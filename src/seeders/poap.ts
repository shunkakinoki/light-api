import { fetchPoapActions } from "@lightdotso/services";
import { Logger } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import { CategoryType, DataType } from "@prisma/client";

import { Key } from "@lightdotso/api/config/key";
import { bulkWrite } from "@lightdotso/api/libs/cf/bulk";
import prisma from "@lightdotso/api/libs/prisma";
import { upstashRest } from "@lightdotso/api/libs/upstash";
import { castAddress } from "@lightdotso/api/utils/castAddress";

export const seedPoap = async (address: string, logger?: LoggerService) => {
  if (!logger) {
    logger = new Logger("seedPoap");
  }
  const poaps = await fetchPoapActions(address);
  logger.log(`${Key.POAP}:::100:::${address} Found ${poaps.length} events`);

  const bulk = [];
  const cmd = ["MSET"];
  for (const poap of poaps) {
    const key = `${Key.POAP}:::${poap.chain === "xdai" ? 100 : 1}:::${
      poap.tokenId
    }`;
    bulk.push({
      key: key,
      value: JSON.stringify(poap),
    });
    cmd.push(key, JSON.stringify(poap));
  }

  const [activityResult, networkResult, redisResult, kvResult] =
    await Promise.all([
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
      bulkWrite(bulk),
    ]);

  logger.log(
    `${Key.POAP}:::100:::${address} Created ${activityResult.count} activities on prisma`,
  );
  logger.log(
    `${Key.POAP}:::100:::${address} Created ${networkResult.count} networks on prisma`,
  );
  logger.log(
    `${Key.SNAPSHOT}:::100:::${address} Created ${redisResult.result} on redis`,
  );
  logger.log(`${Key.POAP}:::100:::${address} Resulted ${kvResult} on kv`);
};
