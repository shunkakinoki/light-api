import { Process, Processor, InjectQueue } from "@nestjs/bull";
import { Inject } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import type { Job, Queue } from "bull";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { castAddress } from "@lightdotso/api/utils/castAddress";
import { BaseProcessor } from "@lightdotso/api/worker/common/baseProcessor";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { PrismaService } from "@lightdotso/api/worker/prisma/prisma.service";

@Processor("timeline")
export class TimelineProcessor extends BaseProcessor {
  constructor(
    @InjectQueue("timeline") private readonly timelineQueue: Queue,
    private prisma: PrismaService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    readonly logger: LoggerService,
  ) {
    super();
  }

  @Process("address")
  async handleAddress(job: Job) {
    const castedAddress = castAddress(job.data.address);
    this.logger.log(
      `Processing ${TimelineProcessor.name}:::${job.id} ${castedAddress}`,
    );
    this.logger.log(`Job: ${JSON.stringify(job)}`);

    try {
      const count = await this.prisma.$executeRawUnsafe(
        `INSERT IGNORE INTO Timeline (networkId, id, address, category, createdAt, chainId, type) SELECT '${
          job.data.networkId ?? castedAddress
        }', id, address, category, createdAt, chainId, type FROM Activity WHERE address = '${castedAddress}' AND category IS NOT NULL;`,
      );
      this.logger.log(`Inserted ${count} into timeline`);
    } catch (err) {
      this.logger.error(
        `Failed job ${job.id} of type ${job.name}: ${err.message}`,
        err.stack,
      );
    }

    const jobs = await this.timelineQueue.getJobs(["waiting"]);
    this.logger.log(
      `Jobs: ${jobs.length > 3 ? JSON.stringify(jobs.slice(0, 3)) : jobs}:`,
    );
    const isWaiting = jobs.some(waitingJob => {
      if (waitingJob.data.networkId) {
        return (
          job.data.networkId === waitingJob.data.networkId &&
          job.data.address === waitingJob.data.address
        );
      }
      return job.data.address === waitingJob.data.address;
    });

    if (isWaiting) {
      this.logger.log(`Found same jobs: removing...`);
      const sameJobs = jobs.filter(waitingJob => {
        if (waitingJob.data.networkId) {
          return (
            job.data.networkId === waitingJob.data.networkId &&
            job.data.address === waitingJob.data.address
          );
        }
        return job.data.address === waitingJob.data.address;
      });
      this.logger.log(`Same jobs: ${JSON.stringify(sameJobs)}`);
      sameJobs.forEach(async sameJob => {
        await sameJob.remove();
      });
    }
  }
}
