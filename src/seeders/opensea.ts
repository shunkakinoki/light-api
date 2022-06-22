import { fetchOpenseaEvents } from "@lightdotso/services";
import type { OpenseaEvents } from "@lightdotso/types";
import { Logger } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import { CategoryType, DataType } from "@prisma/client";

import { Upstash } from "@lightdotso/api/config/upstash";
import prisma from "@lightdotso/api/libs/prisma";
import { upstashRest } from "@lightdotso/api/libs/upstash";

export const seedOpensea = async (
  address: string,
  walk = false,
  logger?: LoggerService,
) => {
  if (!logger) {
    logger = new Logger("seedOpensea");
  }
  let pageNumber = 0;
  let eventsList: OpenseaEvents[] = [];
  do {
    eventsList = eventsList.concat(
      await fetchOpenseaEvents(
        address,
        eventsList.length > 0 ? eventsList[pageNumber - 1].next : undefined,
      ),
    );

    logger.log(
      `${Upstash.OPEN_SEA}:::1:::${address} Found ${eventsList[pageNumber]?.asset_events?.length} events on page ${pageNumber}`,
    );

    const cmd = ["MSET"];
    for (const event of eventsList[pageNumber].asset_events) {
      if (
        event?.transaction?.transaction_hash &&
        event?.asset?.asset_contract?.address &&
        event?.asset?.token_id
      ) {
        cmd.push(
          `${Upstash.OPEN_SEA}:::1:::${event?.transaction?.transaction_hash}:::${event?.asset?.asset_contract?.address}:::${event?.asset?.token_id}`,
          JSON.stringify(event),
        );
      }
      cmd.push(
        `${Upstash.OPEN_SEA}:::${
          event?.transaction?.transaction_hash ? 1 : 0
        }:::${String(event.id)}`,
        JSON.stringify(event),
      );
    }

    const [prismaResult, redisResult] = await Promise.all([
      prisma.activity.createMany({
        data: eventsList[pageNumber].asset_events.map(event => {
          return {
            address: address,
            category: CategoryType.NFT,
            chainId: event?.transaction?.transaction_hash ? 1 : 0,
            createdAt: new Date(event.event_timestamp),
            id: String(event.id),
            type: DataType.OPENSEA,
          };
        }),
        skipDuplicates: true,
      }),
      upstashRest(cmd),
    ]);

    logger.log(
      `${Upstash.OPEN_SEA}:::1:::${address} Created ${prismaResult.count} activities on prisma`,
    );
    logger.log(
      `${Upstash.OPEN_SEA}:::1:::${address} Resulted ${redisResult.result} on redis`,
    );
    pageNumber++;
  } while (eventsList[pageNumber - 1]?.next && walk);
};
