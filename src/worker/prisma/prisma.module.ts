import { Module } from "@nestjs/common";

import { PrismaHealthIndicator } from "@lightdotso/api/worker/prisma/prisma.health";
import { PrismaService } from "@lightdotso/api/worker/prisma/prisma.service";

@Module({
  imports: [],
  providers: [PrismaService, PrismaHealthIndicator],
  exports: [PrismaService, PrismaHealthIndicator],
})
export class PrismaModule {}
