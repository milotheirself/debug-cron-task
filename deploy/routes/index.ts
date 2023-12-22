import { Handler } from '$fresh/server.ts';
import { DEPLOY_BASE_ROUTE } from '../fresh.config.ts';
import { Status } from '$std/http/status.ts';

export const handler: Handler = (req: Request) => {
  return Response.redirect(
    new URL(DEPLOY_BASE_ROUTE, req.url),
    Status.PermanentRedirect,
  );
};
