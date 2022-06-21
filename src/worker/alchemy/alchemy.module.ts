import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { AlchemyController } from "./alchemy.controller";
import { AlchemyProcessor } from "./alchemy.processor";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "alchemy",
      limiter: { max: 5, duration: 1000 },
    }),
    BullModule.registerQueue({
      name: "timeline",
      limiter: { max: 5, duration: 1000 },
    }),
  ],
  controllers: [AlchemyController],
  providers: [AlchemyProcessor],
})
export class AlchemyModule {}
