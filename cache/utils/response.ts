import * as res from "worktop/response";

export const response: typeof res.reply = (code, data, headers) => {
  if (code >= 400 && typeof data === "string") {
    data = { status: code, error: data };
  }
  return res.reply(code, data, headers);
};
