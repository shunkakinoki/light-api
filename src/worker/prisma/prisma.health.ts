import { Injectable } from "@nestjs/common";
import type { HealthIndicatorResult } from "@nestjs/terminus";
import { HealthIndicator, HealthCheckError } from "@nestjs/terminus";

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from "@lightdotso/api/worker/prisma/prisma.service";

@Injectable()
export class PrismaHealthIndicator extends HealthIndicator {
  constructor(private prisma: PrismaService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    let isHealthy = false;
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      isHealthy = true;
    } catch (e) {
      console.error(e);
    }
    const result = this.getStatus("db", isHealthy);

    if (isHealthy) return result;

    throw new HealthCheckError("Prisma check has failed", result);
  }
}
