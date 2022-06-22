import type { LoggerService } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { AddressType } from "@prisma/client";

import { Upstash } from "@lightdotso/api/config/upstash";
import type { TinTinNetwork } from "@lightdotso/api/const/tintin";
import { tintinURL, tintinChainId } from "@lightdotso/api/const/tintin";
import prisma from "@lightdotso/api/libs/prisma";
import { upstashRest } from "@lightdotso/api/libs/upstash";
import { castAddress } from "@lightdotso/api/utils/castAddress";

export const seedTintin = async (
  network: TinTinNetwork,
  logger?: LoggerService,
) => {
  if (!logger) {
    logger = new Logger("seedTintin");
  }

  const tintinContractMapping = await fetch(tintinURL[network]).then(
    async res => {
      const data = await res.text();
      return JSON.parse(`[${data.replaceAll("}", "},").slice(0, -2)}]`);
    },
  );

  logger.log(
    `${Upstash.TIN_TIN}:::${tintinChainId[network]} Found ${tintinContractMapping.length} events`,
  );

  const chunk = (a, n) => {
    return [...Array(Math.ceil(a.length / n))].map((_, i) => {
      return a.slice(n * i, n + n * i);
    });
  };

  const chunks = chunk(tintinContractMapping, 1000);

  for (const id in chunks) {
    const chunk = chunks[id];

    const cmd = ["HMSET", Upstash.TIN_TIN];
    for (const tx of chunk) {
      cmd.push(castAddress(tx.address), tx.name);
    }

    const [prismaResult, redisResult] = await Promise.all([
      prisma.address.createMany({
        data: chunk.map(tx => {
          return {
            id: castAddress(tx.address),
            chainId: tintinChainId[network],
            name: tx.name,
            userId: null,
            type: AddressType.CONTRACT,
          };
        }),
        skipDuplicates: true,
      }),
      upstashRest(cmd),
    ]);

    logger.log(
      `${Upstash.TIN_TIN}:::${tintinChainId[network]} Created ${prismaResult.count} activities on prisma`,
    );
    logger.log(
      `${Upstash.TIN_TIN}:::${tintinChainId[network]} Resulted ${redisResult.result} on redis`,
    );
  }
};
