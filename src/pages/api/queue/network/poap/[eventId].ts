import { fetchPoapEvent } from "@lightdotso/services";
import { poapEventIdSchema, poapEventIdQuerySchema } from "@lightdotso/types";
import type { PoapEvent } from "@lightdotso/types";
import { NetworkType } from "@prisma/client";
import type { NextApiHandler } from "next";

import { bullQueue } from "@lightdotso/api/libs/bull/queue";
import prisma from "@lightdotso/api/libs/prisma";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { eventId } = validator(poapEventIdQuerySchema, req.query);
  const result = await fetchPoapEvent(eventId);
  const safeResult: PoapEvent = validator(poapEventIdSchema, result);

  if (!safeResult) {
    return;
  }

  const network = await prisma.network.upsert({
    where: {
      key_type: {
        key: eventId,
        type: NetworkType.POAP,
      },
    },
    update: {
      type: NetworkType.POAP,
    },
    create: {
      key: eventId,
      type: NetworkType.POAP,
    },
  });

  const networkQueue = bullQueue("network");
  await networkQueue.add(
    "poap",
    { eventId: eventId, networkId: network.id },
    { lifo: true, attempts: 3, backoff: 1500 },
  );

  res.json({
    network: network,
    eventId: eventId,
  });
};

export const followings = apiHandler({
  GET: getHandler,
});

export default followings;
