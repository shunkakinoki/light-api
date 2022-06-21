import type { NextApiHandler } from "next";

import { Upstash } from "@lightdotso/api/config/upstash";
import { upstashRest } from "@lightdotso/api/libs/upstash";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";

const getHandler: NextApiHandler = async (req, res) => {
  const poap = await upstashRest([
    "GET",
    `${Upstash.POAP}:::${req.query.eventId}`,
  ]);

  res.json(JSON.parse(poap.result));
};

export const poap = apiHandler({
  GET: getHandler,
});

export default poap;
