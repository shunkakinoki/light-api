import { Process, Processor, InjectQueue } from "@nestjs/bull";
import { Inject } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import type { Job, Queue } from "bull";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { seedOpensea } from "@lightdotso/api/seeders/opensea";
import { castAddress } from "@lightdotso/api/utils/castAddress";
import { BaseProcessor } from "@lightdotso/api/worker/common/baseProcessor";

@Processor("opensea")
export class OpenseaProcessor extends BaseProcessor {
  constructor(
    @InjectQueue("timeline") private readonly timelineQueue: Queue,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    readonly logger: LoggerService,
  ) {
    super();
  }

  @Process("address")
  async handleEVM(job: Job) {
    const castedAddress = castAddress(job.data.address);
    this.logger.log(
      `Processing ${OpenseaProcessor.name}:::${job.id} ${castedAddress}`,
    );
    this.logger.log(`Job: ${JSON.stringify(job)}`);
    try {
      await seedOpensea(castedAddress, true, this.logger);
      this.timelineQueue.add("address", {
        networkId: job.data.networkId,
        address: castedAddress,
      });
      return { processor: true };
    } catch (err) {
      this.logger.error(
        `Failed job ${job.id} of type ${job.name}: ${err.message}`,
        err.stack,
      );
    }
  }
}
