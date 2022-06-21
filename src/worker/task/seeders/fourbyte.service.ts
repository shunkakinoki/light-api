import { Injectable, Inject } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { seedFourbyte } from "@lightdotso/api/seeders/fourbyte";

@Injectable()
export class FourbyteService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    readonly logger: LoggerService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async log() {
    this.logger.log(
      `Processing ${
        FourbyteService.name
      } at ${new Date().toLocaleDateString()}`,
    );
    await seedFourbyte(this.logger);
  }
}
