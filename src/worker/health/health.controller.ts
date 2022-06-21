import { Controller, Get } from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HealthCheck, HealthCheckService } from "@nestjs/terminus";

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaHealthIndicator } from "@lightdotso/api/worker/prisma/prisma.health";

@Controller("health")
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prisma: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => {
        return this.prisma.isHealthy();
      },
    ]);
  }
}
