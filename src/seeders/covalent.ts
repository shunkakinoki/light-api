import { fetchCovalentTransactions } from "@lightdotso/services";
import type { CovalentTransactions } from "@lightdotso/types";
import { Logger } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import { DataType } from "@prisma/client";

import { Upstash } from "@lightdotso/api/config/upstash";
import prisma from "@lightdotso/api/libs/prisma";
import { upstashRest } from "@lightdotso/api/libs/upstash";
import { castAddress } from "@lightdotso/api/utils/castAddress";

export const seedCovalent = async (
  address: string,
  networkId?: number,
  walk = false,
  logger?: LoggerService,
) => {
  if (!logger) {
    logger = new Logger("seedCovalent");
  }
  if (!networkId) {
    networkId = 1;
  }
  let pageNumber = 0;
  let txs: CovalentTransactions[] = [];
  do {
    txs = txs.concat(
      await fetchCovalentTransactions(address, networkId, pageNumber),
    );

    logger.log(
      `${Upstash.COVALENT}:::${networkId}:::${address} Found ${txs[pageNumber].data.items.length} events on page ${pageNumber}`,
    );

    const cmd = ["MSET"];
    for (const tx of txs[pageNumber].data.items) {
      cmd.push(
        `${Upstash.COVALENT}:::${networkId}:::${tx.tx_hash}`,
        JSON.stringify(tx),
      );
    }

    const [prismaResult, redisResult] = await Promise.all([
      prisma.activity.createMany({
        data: txs[pageNumber].data.items.map(tx => {
          return {
            address: castAddress(tx.from_address),
            category: null,
            chainId: networkId,
            createdAt: new Date(tx.block_signed_at),
            id: tx.tx_hash,
            type: DataType.COVALENT,
          };
        }),
        skipDuplicates: true,
      }),
      upstashRest(cmd),
    ]);

    logger.log(
      `${Upstash.COVALENT}:::${networkId}:::${address} Created ${prismaResult.count} activities on prisma`,
    );
    logger.log(
      `${Upstash.COVALENT}:::${networkId}:::${address} Resulted ${redisResult.result} on redis`,
    );
    pageNumber++;
  } while (txs[pageNumber - 1]?.data?.pagination?.has_more && walk);
};
