import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { QueueController } from "./queue.controller";

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: "network",
        limiter: { max: 5, duration: 1000 },
      },
      {
        name: "alchemy",
        limiter: { max: 5, duration: 1000 },
      },
      {
        name: "covalent",
        limiter: { max: 5, duration: 1000 },
      },
      {
        name: "opensea",
        limiter: { max: 5, duration: 1000 },
      },
      {
        name: "poap",
        limiter: { max: 5, duration: 1000 },
      },
      {
        name: "snapshot",
        limiter: { max: 5, duration: 1000 },
      },
      {
        name: "timeline",
        limiter: { max: 5, duration: 1000 },
      },
    ),
  ],
  controllers: [QueueController],
})
export class QueueModule {}
