import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { SnapshotController } from "./snapshot.controller";
import { SnapshotProcessor } from "./snapshot.processor";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "snapshot",
      limiter: { max: 5, duration: 1000 },
    }),
    BullModule.registerQueue({
      name: "timeline",
      limiter: { max: 5, duration: 1000 },
    }),
  ],
  controllers: [SnapshotController],
  providers: [SnapshotProcessor],
})
export class SnapshotModule {}
