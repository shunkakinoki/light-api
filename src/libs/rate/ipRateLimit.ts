import { getIP } from "./getIP";
import type { CountFn } from "./rateLimit";
import { initRateLimit } from "./rateLimit";

import { RATE_LIMIT, RATE_TIMEFRAME } from "@lightdotso/api/config/rate";
import { upstashRest } from "@lightdotso/api/libs/upstash";

export const ipRateLimit = initRateLimit(request => {
  return {
    id: `ip:${getIP(request)}`,
    count: increment,
    limit: RATE_LIMIT,
    timeframe: RATE_TIMEFRAME,
  };
});

const increment: CountFn = async ({ key, timeframe }) => {
  const results = await upstashRest(
    [
      ["INCR", key],
      ["EXPIRE", key, timeframe],
    ],
    { pipeline: true },
  );
  return results[0].result;
};
