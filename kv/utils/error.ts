import * as res from "worktop/response";

import { response } from "./response";

export const toError = (code: number, error?: Error): Response => {
  let body = (error && error.message) || res.STATUS_CODES[code];
  return response(code, body || String(code));
};
