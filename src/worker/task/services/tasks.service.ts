import { Injectable, Inject } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Injectable()
export class TasksService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    readonly logger: LoggerService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async log() {
    this.logger.debug(new Date().toLocaleDateString());
  }
}
