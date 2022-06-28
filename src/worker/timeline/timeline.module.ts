import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { TimelineController } from "./timeline.controller";
import { TimelineProcessor } from "./timeline.processor";

import { PrismaModule } from "@lightdotso/api/worker/prisma/prisma.module";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "timeline",
      limiter: { max: 5, duration: 3000 },
    }),
    PrismaModule,
  ],
  controllers: [TimelineController],
  providers: [TimelineProcessor],
})
export class TimelineModule {}
