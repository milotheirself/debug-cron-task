import { Handler } from '$fresh/server.ts';
import { message_response } from './_404.ts';
import { Status } from '$std/http/status.ts';

export const handler: Handler = (req: Request) => {
  const url = new URL(req.url);
  const router = url.pathname.split('/').filter((s: string) => s !== '');

  return message_response({
    message: `Hello from "${router}"`,
    code: Status.OK,
  });
};
