import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { PoapController } from "./poap.controller";
import { PoapProcessor } from "./poap.processor";

import { PrismaModule } from "@lightdotso/api/worker/prisma/prisma.module";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "poap",
      limiter: { max: 5, duration: 1000 },
    }),
    BullModule.registerQueue({
      name: "timeline",
      limiter: { max: 5, duration: 1000 },
    }),
    PrismaModule,
  ],
  controllers: [PoapController],
  providers: [PoapProcessor],
})
export class PoapModule {}
