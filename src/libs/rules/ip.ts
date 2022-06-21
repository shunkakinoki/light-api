import type { NextRequest } from "next/server";

import { Upstash } from "@lightdotso/api/config/upstash";
import { getIP } from "@lightdotso/api/libs/rate/getIP";
import { upstashRest } from "@lightdotso/api/libs/upstash";

export const blockedIp = async (request: NextRequest): Promise<boolean> => {
  try {
    const { result } = await upstashRest([
      "HGET",
      Upstash.IP_RULES,
      getIP(request),
    ]);

    if (!result) return false;

    const data = JSON.parse(result);

    return data.action === "block";
  } catch (err) {
    console.error("IP validation failed:", err);
    return false;
  }
};
