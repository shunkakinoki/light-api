import { OnQueueCompleted, OnQueueFailed, OnQueueStalled } from "@nestjs/bull";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LoggerService } from "@nestjs/common";
import * as Sentry from "@sentry/node";
import type { Job } from "bull";

export abstract class BaseProcessor {
  protected abstract logger: LoggerService;

  @OnQueueCompleted()
  onCompleted(job: Job<any>) {
    this.logger.log(`Job ${job.id} of type ${job.name} succeeded`);
    this.logger.log(`Job: ${JSON.stringify(job)}`);
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    Sentry.captureException(error);
    this.logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack,
    );
  }

  @OnQueueStalled()
  onStalled(job: Job<any>) {
    this.logger.log(`Job ${job.id} of type ${job.name} stalled!`);
    this.logger.log(`Job: ${JSON.stringify(job)}`);
  }
}
