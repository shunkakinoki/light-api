import type { NextApiHandler } from "next";

import { Upstash } from "@lightdotso/api/config/upstash";
import { upstashRest } from "@lightdotso/api/libs/upstash";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";

const getHandler: NextApiHandler = async (req, res) => {
  const [dbsize, api_keys, four_byte, ip_rules] = await Promise.all([
    upstashRest(["DBSIZE"]),
    upstashRest(["HLEN", Upstash.API_KEYS]),
    upstashRest(["HLEN", Upstash.FOUR_BYTE]),
    upstashRest(["HLEN", Upstash.IP_RULES]),
  ]);

  res.json({
    dbsize: dbsize.result,
    apiKeys: api_keys.result,
    four_byte: four_byte.result,
    ip_rules: ip_rules.result,
  });
};

export const featured = apiHandler({
  GET: getHandler,
});

export default featured;
