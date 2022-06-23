import { compose } from "worktop";

// eslint-disable-next-line no-restricted-imports
import * as database from "../utils/database";
// eslint-disable-next-line no-restricted-imports
import { response } from "../utils/response";

export const list = compose(async (req, context) => {
  const key = context.params.key as string;
  const keys = key.split("___");

  const items = await Promise.all([
    keys.forEach(key => {
      return database.read(key);
    }),
  ]);

  const res = response(200, items);
  res.headers.set("Cache-Control", "max-age=300");
  return res;
});
