import { fetchCyberconnectFollowings } from "@lightdotso/services";
import { cyberconnectFollowingsQuerySchema } from "@lightdotso/types";
import { NetworkType } from "@prisma/client";
import type { NextApiHandler } from "next";

import { bullQueue } from "@lightdotso/api/libs/bull/queue";
import prisma from "@lightdotso/api/libs/prisma";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { castAddress } from "@lightdotso/api/utils/castAddress";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { address, first, after } = validator(
    cyberconnectFollowingsQuerySchema,
    req.query,
  );
  const safeResult = await fetchCyberconnectFollowings(
    address,
    first ? parseInt(first) : 3,
    after,
  );

  if (!safeResult) {
    return;
  }

  const network = await prisma.network.upsert({
    where: {
      key_type: {
        key: address,
        type: NetworkType.CYBERCONNECT,
      },
    },
    update: {
      type: NetworkType.CYBERCONNECT,
    },
    create: {
      key: address,
      type: NetworkType.CYBERCONNECT,
    },
  });

  const networkQueue = bullQueue("network");
  await networkQueue.add(
    "cyberconnect",
    { address: castAddress(address), networkId: network.id },
    { lifo: true, attempts: 3, backoff: 1500 },
  );

  res.json({
    address: address,
    network: network,
  });
};

export const followings = apiHandler({
  GET: getHandler,
});

export default followings;
