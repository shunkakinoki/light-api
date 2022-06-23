import { fetchOpenseaEvents } from "@lightdotso/services";
import type { OpenseaEvents } from "@lightdotso/types";
import { Logger } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import { CategoryType, DataType } from "@prisma/client";

import { Key } from "@lightdotso/api/config/key";
import { bulkWrite } from "@lightdotso/api/libs/cf/bulk";
import prisma from "@lightdotso/api/libs/prisma";

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
      `${Key.OPEN_SEA}:::1:::${address} Found ${eventsList[pageNumber]?.asset_events?.length} events on page ${pageNumber}`,
    );

    const bulk = [];
    for (const event of eventsList[pageNumber].asset_events) {
      if (
        event?.transaction?.transaction_hash &&
        event?.asset?.asset_contract?.address &&
        event?.asset?.token_id
      ) {
        bulk.push({
          key: `${Key.OPEN_SEA}:::1:::${event?.transaction?.transaction_hash}:::${event?.asset?.asset_contract?.address}:::${event?.asset?.token_id}`,
          value: JSON.stringify(event),
        });
      }
      bulk.push({
        key: `${Key.OPEN_SEA}:::${
          event?.transaction?.transaction_hash ? 1 : 0
        }:::${String(event.id)}`,
        value: JSON.stringify(event),
      });
    }

    const [prismaResult, kvResult] = await Promise.all([
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
      bulkWrite(bulk),
    ]);

    logger.log(
      `${Key.OPEN_SEA}:::1:::${address} Created ${prismaResult.count} activities on prisma`,
    );
    logger.log(
      `${Key.OPEN_SEA}:::1:::${address} Resulted ${kvResult} on redis`,
    );
    pageNumber++;
  } while (eventsList[pageNumber - 1]?.next && walk);
};
