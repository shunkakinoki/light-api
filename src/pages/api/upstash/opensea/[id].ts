import type { NextApiHandler } from "next";

import { Upstash } from "@lightdotso/api/config/upstash";
import { upstashRest } from "@lightdotso/api/libs/upstash";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";

const getHandler: NextApiHandler = async (req, res) => {
  const poap = await upstashRest([
    "GET",
    `${Upstash.OPEN_SEA}:::${req.query.id}`,
  ]);

  res.json(JSON.parse(poap.result));
};

export const openSea = apiHandler({
  GET: getHandler,
});

export default openSea;
