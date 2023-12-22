import { Handler } from '$fresh/server.ts';
import { Status, STATUS_TEXT } from '$std/http/status.ts';

type StaticMessage = {
  code?: Status;
  text?: string;
  message?: string;
};

export function message_response(
  { code, text, message }: StaticMessage,
): Response {
  const status_code = code || Status.NotFound;
  const status_text = text || STATUS_TEXT[status_code];

  return Response.json({
    message: message || `${status_code}: ${status_text}`,
    code: 0,
  });
}

export const handler: Handler = () => {
  return message_response({ code: Status.NotFound });
};
