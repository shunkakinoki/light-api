import { fetchAlchemyTokenTransactions } from "@lightdotso/services";
import { Logger } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import { DataType } from "@prisma/client";

import { Upstash } from "@lightdotso/api/config/upstash";
import { provider } from "@lightdotso/api/libs/ethers/provider";
import prisma from "@lightdotso/api/libs/prisma";
import { upstashRest } from "@lightdotso/api/libs/upstash";
import { castAddress } from "@lightdotso/api/utils/castAddress";

export const seedAlchemy = async (address: string, logger?: LoggerService) => {
  if (!logger) {
    logger = new Logger("seedAlchemy");
  }
  const events = await fetchAlchemyTokenTransactions(address);
  const timePromises = events?.result?.transfers.map(tx => {
    return provider.getBlock(tx.blockNum);
  });
  const times = await Promise.all(timePromises);

  logger.log(`Found ${events.result.transfers.length} events`);

  const cmd = ["MSET"];
  for (const event of events.result.transfers) {
    cmd.push(`${Upstash.ALCHEMY}:::${event.hash}`, JSON.stringify(event));
  }

  const [prismaResult, redisResult] = await Promise.all([
    prisma.activity.createMany({
      data: events.result.transfers.map((tx, i) => {
        return {
          address: castAddress(tx.from),
          category: null,
          chainId: 1,
          createdAt: new Date(times[i].timestamp * 1000),
          id: tx.hash,
          type: DataType.ALCHEMY,
        };
      }),
      skipDuplicates: true,
    }),
    upstashRest(cmd),
  ]);

  logger.log(`Created ${prismaResult.count} activities on prisma`);
  logger.log(`Resulted ${redisResult.result} on redis`);
};
