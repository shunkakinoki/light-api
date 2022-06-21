import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { CovalentController } from "./covalent.controller";
import { CovalentProcessor } from "./covalent.processor";

import { PrismaModule } from "@lightdotso/api/worker/prisma/prisma.module";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "covalent",
      limiter: { max: 5, duration: 1000 },
    }),
    BullModule.registerQueue({
      name: "timeline",
      limiter: { max: 5, duration: 1000 },
    }),
    PrismaModule,
  ],
  controllers: [CovalentController],
  providers: [CovalentProcessor],
})
export class CovalentModule {}
