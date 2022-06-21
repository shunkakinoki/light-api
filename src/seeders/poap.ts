import { fetchPoapActions } from "@lightdotso/services";
import { Logger } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import { CategoryType, DataType } from "@prisma/client";

import { Upstash } from "@lightdotso/api/config/upstash";
import prisma from "@lightdotso/api/libs/prisma";
import { upstashRest } from "@lightdotso/api/libs/upstash";
import { castAddress } from "@lightdotso/api/utils/castAddress";

export const seedPoap = async (address: string, logger?: LoggerService) => {
  if (!logger) {
    logger = new Logger("seedPoap");
  }
  const poaps = await fetchPoapActions(address);
  logger.log(`Found ${poaps.length} events`);

  const cmd = ["MSET"];
  for (const poap of poaps) {
    cmd.push(`${Upstash.POAP}:::${poap.tokenId}`, JSON.stringify(poap));
  }

  const [activityResult, networkResult, redisResult] = await Promise.all([
    prisma.activity.createMany({
      data: poaps.map(poap => {
        return {
          address: castAddress(poap.owner),
          category: CategoryType.SOCIAL,
          chainId: poap.chain === "xdai" ? 100 : 1,
          createdAt: new Date(poap.created),
          id: poap.tokenId,
          type: DataType.POAP,
        };
      }),
      skipDuplicates: true,
    }),
    prisma.network.createMany({
      data: poaps.map(poap => {
        return {
          name: poap.event.name,
          image_url: poap.event.image_url,
          key: poap.tokenId,
          type: DataType.POAP,
        };
      }),
      skipDuplicates: true,
    }),
    upstashRest(cmd),
  ]);

  logger.log(`Created ${activityResult.count} activities on prisma`);
  logger.log(`Created ${networkResult.count} networks on prisma`);
  logger.log(`Resulted ${redisResult.result} on redis`);
};
