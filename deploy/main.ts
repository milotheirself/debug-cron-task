/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

// // ---
// import './cron/insight-kv.ts';
// // ---
import { start } from '$fresh/server.ts';

import config from './fresh.config.ts';
import manifest from './fresh.gen.ts';

// ---
import { insight, insight_kv, warning } from './cron/insight-kv.ts';

Deno.cron('insight-kv', '*/20 * * * *', async () => {
  const kv_day = new Date().toISOString().split('T')[0];
  const kv_atomic = insight_kv.atomic();

  for (const k in insight['timeline']) {
    kv_atomic.sum(
      ['insight', 'timeline', k, kv_day],
      insight['timeline'][k].hits,
    );
  }

  kv_atomic.sum(['insight', '@total'], insight['@total']);
  kv_atomic.sum(
    ['insight', '@total-noise-ignored'],
    insight['@total-noise-ignored'],
  );

  insight['@total'] = 0n;
  insight['@total-noise-ignored'] = 0n;
  insight['timeline'] = {};

  for (const k in warning) {
    // context: https://discord.com/channels/684898665143206084/1164280958896308275/1164280958896308275
    //          https://discord.com/invite/deno

    if (warning[k].hits >= 1) {
      console.debug('[noise-warning]', { remoteAddr: k, ...warning[k] });
    }

    delete warning[k];
  }

  await kv_atomic.commit();
});
// ---

await start(manifest, config);
