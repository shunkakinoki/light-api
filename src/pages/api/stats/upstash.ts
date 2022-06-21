import type { NextApiHandler } from "next";

import { Upstash } from "@lightdotso/api/config/upstash";
import { upstashRest } from "@lightdotso/api/libs/upstash";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";

const getHandler: NextApiHandler = async (req, res) => {
  const [
    dbsize,
    alchemy,
    api_keys,
    covalent,
    four_byte,
    ip_rules,
    open_sea,
    poap,
    snapshot,
    tin_tin,
  ] = await Promise.all([
    upstashRest(["DBSIZE"]),
    upstashRest(["HLEN", Upstash.ALCHEMY]),
    upstashRest(["HLEN", Upstash.API_KEYS]),
    upstashRest(["HLEN", Upstash.COVALENT]),
    upstashRest(["HLEN", Upstash.FOUR_BYTE]),
    upstashRest(["HLEN", Upstash.IP_RULES]),
    upstashRest(["HLEN", Upstash.OPEN_SEA]),
    upstashRest(["HLEN", Upstash.POAP]),
    upstashRest(["HLEN", Upstash.SNAPSHOT]),
    upstashRest(["HLEN", Upstash.TIN_TIN]),
  ]);

  res.json({
    dbsize: dbsize.result,
    alchemy: alchemy.result,
    apiKeys: api_keys.result,
    covalent: covalent.result,
    fourByte: four_byte.result,
    ipRules: ip_rules.result,
    opesnSea: open_sea.result,
    poap: poap.result,
    snapshot: snapshot.result,
    tinTin: tin_tin.result,
  });
};

export const featured = apiHandler({
  GET: getHandler,
});

export default featured;
