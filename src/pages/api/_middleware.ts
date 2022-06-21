import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { tokenRateLimit } from "@lightdotso/api/libs/rate/keys";

export const middleware = async (req: NextRequest): Promise<Response> => {
  const response = NextResponse.next();

  const res = await tokenRateLimit(req);
  if (res.status !== 200) {
    return res;
  }

  const RATE_LIMIT_HEADERS = [
    "x-ratelimit-limit",
    "x-ratelimit-remaining",
    "x-ratelimit-reset",
    "x-upstash-latency",
  ];
  RATE_LIMIT_HEADERS.forEach(header => {
    response.headers.set(header, res.headers.get(header));
  });

  return response;
};
