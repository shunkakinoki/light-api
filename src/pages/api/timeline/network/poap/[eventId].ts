import { timelinePoapQuerySchema } from "@lightdotso/types";
import { NetworkType } from "@prisma/client";
import type { CategoryType, DataType } from "@prisma/client";
import type { NextApiHandler } from "next";

import prisma from "@lightdotso/api/libs/prisma";
import { augmentTimeline } from "@lightdotso/api/libs/timeline/augment";
import { apiHandler } from "@lightdotso/api/utils/apiHandler";
import { validator } from "@lightdotso/api/utils/validator";

const getHandler: NextApiHandler = async (req, res) => {
  const { category, eventId, cursor } = validator(
    timelinePoapQuerySchema,
    req.query,
  );

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

  if (!network) {
    return res.json({
      timeline: null,
      cursor: cursor,
      isEnd: true,
    });
  }

  if (cursor) {
    const [id, chainId, type, networkId] = cursor.split("-");

    const [timeline] = await Promise.all([
      prisma.timeline.findMany({
        where: {
          category: category ? (category as CategoryType) : undefined,
          networkId: network.id,
        },
        orderBy: { createdAt: "desc" },
        cursor: {
          id_chainId_type_networkId: {
            id: id,
            chainId: parseInt(chainId),
            type: type as DataType,
            networkId: networkId,
          },
        },
        skip: 1,
        take: 31,
      }),
    ]);

    if (timeline.length === 0) {
      return res.json({
        timeline: null,
        cursor: cursor,
        isEnd: true,
      });
    }
    const result = await augmentTimeline(timeline);
    const last = result[result.length - 2];

    return res.json({
      timeline: result.slice(0, -1),
      cursor: `${last.id}-${last.chainId}-${last.type}-${last.networkId}`,
      isEnd: result.length !== 31,
    });
  }

  const [timeline] = await Promise.all([
    prisma.timeline.findMany({
      where: {
        category: category ? (category as CategoryType) : undefined,
        networkId: network.id,
      },
      orderBy: { createdAt: "desc" },
      take: 31,
    }),
  ]);

  if (timeline.length === 0) {
    return res.json({
      timeline: null,
      cursor: cursor,
      isEnd: true,
    });
  }
  const result = await augmentTimeline(timeline);
  const last = result[result.length - 2];

  return res.json({
    timeline: result.slice(0, -1),
    cursor: `${last.id}-${last.chainId}-${last.type}-${last.networkId}`,
    isEnd: result.length !== 31,
  });
};

export const eventId = apiHandler({
  GET: getHandler,
});

export default eventId;
