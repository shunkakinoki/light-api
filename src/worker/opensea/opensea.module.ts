import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { OpenseaController } from "./opensea.controller";
import { OpenseaProcessor } from "./opensea.processor";

import { PrismaModule } from "@lightdotso/api/worker/prisma/prisma.module";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "opensea",
      limiter: { max: 5, duration: 1000 },
    }),
    BullModule.registerQueue({
      name: "timeline",
      limiter: { max: 5, duration: 1000 },
    }),
    PrismaModule,
  ],
  controllers: [OpenseaController],
  providers: [OpenseaProcessor],
})
export class OpenseaModule {}
