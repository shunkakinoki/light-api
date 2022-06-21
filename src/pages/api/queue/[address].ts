import { poapActionsQuerySchema } from "@lightdotso/types";
import { NetworkType } from "@prisma/client";
import type { NextApiHandler } from "next";

import { bullQueue } from "@lightdotso/api/libs/bull/queue";
import prisma from "@lightdotso/api/libs/prisma";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { castAddress } from "@lightdotso/api/utils/castAddress";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address } = validator(poapActionsQuerySchema, req.query);

  const network = await prisma.network.upsert({
    where: {
      key_type: {
        key: address,
        type: NetworkType.SELF,
      },
    },
    update: {
      type: NetworkType.SELF,
    },
    create: {
      key: address,
      type: NetworkType.SELF,
    },
  });

  const networkQueue = bullQueue("network");
  await networkQueue.add(
    "self",
    { address: castAddress(address), networkId: network.id },
    { lifo: true, attempts: 3, backoff: 1500 },
  );

  res.setHeader(
    "Cache-Control",
    `public, immutable, no-transform, s-maxage=30, max-age=30`,
  );
  res.json({
    queue: true,
  });
};

export const all = apiHandler({
  GET: getHandler,
});

export default all;
