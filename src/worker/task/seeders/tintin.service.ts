import { Injectable, Inject } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { seedTintin } from "@lightdotso/api/seeders/tintin";

@Injectable()
export class TintinService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    readonly logger: LoggerService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async mainnet() {
    this.logger.log(
      `Processing ${
        TintinService.name
      }::MAINNET at ${new Date().toLocaleDateString()}`,
    );
    await seedTintin("MAINNET", this.logger);
  }

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async polygon() {
    this.logger.log(
      `Processing ${
        TintinService.name
      }::POLYGON at ${new Date().toLocaleDateString()}`,
    );
    await seedTintin("POLYGON", this.logger);
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async arbitrum() {
    this.logger.log(
      `Processing ${
        TintinService.name
      }::ARBITRUM at ${new Date().toLocaleDateString()}`,
    );
    await seedTintin("ARBITRUM", this.logger);
  }
}
