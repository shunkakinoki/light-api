import { Router, compose } from "worktop";
import * as cfw from "worktop/cfw";
import * as Cache from "worktop/cfw.cache";
import * as CORS from "worktop/cors";

import * as Galaxy from "./routes/galaxy";
import * as Network from "./routes/network";
import * as Poap from "./routes/poap";
import * as Snapshot from "./routes/snapshot";
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

API.add("GET", "/poap/:address", Poap.get);
API.add("GET", "/galaxy/:address", Galaxy.list);
API.add("GET", "/snapshot/:address", Snapshot.list);
API.add("GET", "/network/:address", Network.list);
API.add("GET", "/network/raw/:address", Network.raw);

cfw.listen(API.run);
