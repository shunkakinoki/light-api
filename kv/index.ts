import { Router, compose } from "worktop";
import * as cfw from "worktop/cfw";
import * as Cache from "worktop/cfw.cache";
import * as CORS from "worktop/cors";

// eslint-disable-next-line no-restricted-imports
import * as KV from "./routes/kv";
import type { Context } from "./types/context";
import { toError } from "./utils/error";

const API = new Router<Context>();

API.prepare = compose(
  Cache.sync(),
  CORS.preflight({
    origin: "*",
    maxage: 86400,
    credentials: true,
  }),
);

API.onerror = function (req, context) {
  let { error, status = 500 } = context;
  return toError(status, error);
};

API.add("GET", "/:key", KV.list);

cfw.listen(API.run);
