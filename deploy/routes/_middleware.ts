import { FreshContext, MiddlewareHandler } from '$fresh/server.ts';
import { message_response } from './_404.ts';
import { DEPLOY_SUBPATHS } from '../fresh.config.ts';
import { Status } from '$std/http/status.ts';

import { insight, warning } from '../cron/insight-kv.ts';

export const handler: MiddlewareHandler = (req: Request, ctx: FreshContext) => {
  const req_urn = new URL(req.url).pathname.toLowerCase();

  // ? filter out noise
  const is_pathed = //
    req_urn === '/' ||
    req_urn === '/robots.txt' ||
    req_urn.startsWith('/assets') ||
    req_urn.startsWith('/locals') ||
    (req_urn.split('/')[1] ?? '@no-subpath') in DEPLOY_SUBPATHS;

  // + ignored; when method not allowed
  if (req.method !== 'GET') {
    insight['@total-noise-ignored'] += 1n;

    return message_response({ code: Status.MethodNotAllowed });
  }

  // + ignored; when requesting known/acceptable noise
  if (
    !is_pathed && (
      req_urn.endsWith('.css') ||
      req_urn.endsWith('.ico') ||
      req_urn.endsWith('.js') ||
      req_urn.endsWith('.png') ||
      req_urn.endsWith('.webp') ||
      req_urn.startsWith('/.well-known')
    )
  ) {
    insight['@total-noise-ignored'] += 1n;

    return message_response({ code: Status.NotFound });
  }

  // + ignored; when requesting unknown noise
  if (!is_pathed) {
    const req_ip = (ctx.remoteAddr as Deno.NetAddr).hostname;
    if (!(req_ip in warning)) warning[req_ip] = { hits: 0n, urns: [] };

    insight['@total-noise-ignored'] += 1n;
    warning[req_ip].hits += 1n;
    warning[req_ip].urns = [...new Set([...warning[req_ip].urns, req_urn])];

    return message_response({ code: Status.NotFound });
  }

  if (!(req_urn in insight['timeline'])) {
    insight['timeline'][req_urn] = { hits: 0n };
  }

  insight['timeline'][req_urn].hits += 1n;
  insight['@total'] += 1n;

  return ctx.next();
};
