import { jwtVerify } from "jose";

import { API_KEYS_JWT_SECRET_KEY } from "./constants";

import { Upstash } from "@lightdotso/api/config/upstash";
import { ipRateLimit } from "@lightdotso/api/libs/rate/ipRateLimit";
import { initRateLimit } from "@lightdotso/api/libs/rate/rateLimit";
import { upstashRest } from "@lightdotso/api/libs/upstash";

export type ApiTokenPayload = {
  jti: string;
  iat: number;
  limit: number;
  timeframe: number;
};

const tokenExpired = (): Response => {
  return new Response(
    JSON.stringify({ error: { message: "Your token has expired" } }),
    {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

export const tokenRateLimit = initRateLimit(async request => {
  const token = request.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return ipRateLimit(request);
  }

  let payload: ApiTokenPayload;
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(API_KEYS_JWT_SECRET_KEY),
    );
    payload = verified.payload as ApiTokenPayload;
  } catch (err) {
    return tokenExpired();
  }

  return {
    ...payload,
    id: `api-token:${payload.jti}`,
    count: async ({ key, timeframe }): Promise<any> => {
      const results = await upstashRest(
        [
          ["HGET", Upstash.API_KEYS, payload.jti],
          ["INCR", key],
          ["EXPIRE", key, timeframe],
        ],
        { pipeline: true },
      );
      const jwt = results[0].result;
      const count = results[1].result;

      if (!jwt) {
        return tokenExpired();
      }

      return count;
    },
  };
});
