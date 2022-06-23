import { fetchSnapshotVotes } from "@lightdotso/services";
import type { LoggerService } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { CategoryType, DataType } from "@prisma/client";

import { Key } from "@lightdotso/api/config/key";
import { bulkWrite } from "@lightdotso/api/libs/cf/bulk";
import prisma from "@lightdotso/api/libs/prisma";
import { castAddress } from "@lightdotso/api/utils/castAddress";

export const seedSnapshot = async (address: string, logger?: LoggerService) => {
  if (!logger) {
    logger = new Logger("seedSnapshot");
  }
  const votes = await fetchSnapshotVotes(address);
  logger.log(
    `${Key.SNAPSHOT}:::0:::${address} Found ${votes.votes.length} events`,
  );

  const bulk = [];
  for (const vote of votes.votes) {
    bulk.push({
      key: `${Key.SNAPSHOT}:::0:::${vote.id}`,
      value: JSON.stringify(vote),
    });
  }

  const [activityResult, networkResult, kvResult] = await Promise.all([
    prisma.activity.createMany({
      data: votes.votes.map(vote => {
        return {
          address: castAddress(vote.voter),
          category: CategoryType.DAO,
          chainId: 0,
          createdAt: new Date(vote.created * 1000),
          id: vote.id,
          type: DataType.SNAPSHOT,
        };
      }),
      skipDuplicates: true,
    }),
    prisma.network.createMany({
      data: votes.votes.map(vote => {
        return {
          name: vote.space.name,
          image_url: vote.space.avatar,
          key: vote.space.id,
          type: DataType.POAP,
        };
      }),
      skipDuplicates: true,
    }),
    bulkWrite(bulk),
  ]);

  logger.log(
    `${Key.SNAPSHOT}:::0:::${address} Created ${activityResult.count} activities on prisma`,
  );
  logger.log(
    `${Key.SNAPSHOT}:::0:::${address} Created ${networkResult.count} networks on prisma`,
  );
  logger.log(`${Key.SNAPSHOT}:::0:::${address} Resulted ${kvResult} on kv`);
};
