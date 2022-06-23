import { fetchAlchemyTokenTransactions } from "@lightdotso/services";
import { Logger } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import { DataType } from "@prisma/client";

import { Key } from "@lightdotso/api/config/key";
import { bulkWrite } from "@lightdotso/api/libs/cf/bulk";
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

  logger.log(
    `${Key.ALCHEMY}:::1:::${address} Found ${events.result.transfers.length} events`,
  );

  const bulk = [];
  const cmd = ["MSET"];
  for (const event of events.result.transfers) {
    bulk.push({
      key: `${Key.ALCHEMY}:::1:::${event.hash}`,
      value: JSON.stringify(event),
    });
    cmd.push(`${Key.ALCHEMY}:::1:::${event.hash}`, JSON.stringify(event));
  }

  const [prismaResult, redisResult, kvResult] = await Promise.all([
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
    bulkWrite(bulk),
  ]);

  logger.log(
    `${Key.ALCHEMY}:::1:::${address} Created ${prismaResult.count} activities on prisma`,
  );
  logger.log(
    `${Key.ALCHEMY}:::1:::${address} Created ${redisResult.result} activities on redis`,
  );
  logger.log(`${Key.ALCHEMY}:::1:::${address} Resulted ${kvResult} on kv`);
};
