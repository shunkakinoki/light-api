import { fetchSnapshotVoters } from "@lightdotso/services";
import type { SnapshotVoters } from "@lightdotso/types";
import {
  snapshotSpaceQuerySchema,
  snapshotVotersSchema,
} from "@lightdotso/types";
import { NetworkType } from "@prisma/client";
import type { NextApiHandler } from "next";

import { bullQueue } from "@lightdotso/api/libs/bull/queue";
import prisma from "@lightdotso/api/libs/prisma";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { spaceId } = validator(snapshotSpaceQuerySchema, req.query);
  const result = await fetchSnapshotVoters(spaceId, 3);
  const safeResult: SnapshotVoters = validator(snapshotVotersSchema, result);

  if (!safeResult) {
    return;
  }

  const network = await prisma.network.upsert({
    where: {
      key_type: {
        key: spaceId,
        type: NetworkType.DAO,
      },
    },
    update: {
      type: NetworkType.DAO,
    },
    create: {
      key: spaceId,
      type: NetworkType.DAO,
    },
  });

  const networkQueue = bullQueue("network");
  await networkQueue.add(
    "snapshot",
    { spaceId: spaceId, networkId: network.id },
    { lifo: true, attempts: 3, backoff: 1500 },
  );

  res.json({
    network: network,
    spaceId: spaceId,
  });
};

export const followings = apiHandler({
  GET: getHandler,
});

export default followings;
