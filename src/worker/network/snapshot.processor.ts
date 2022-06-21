import { fetchSnapshotVoters } from "@lightdotso/services";
import type { SnapshotVoters } from "@lightdotso/types";
import { Process, Processor, InjectQueue } from "@nestjs/bull";
import { Inject } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import type { Job, Queue } from "bull";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { castAddress } from "@lightdotso/api/utils/castAddress";
import { BaseProcessor } from "@lightdotso/api/worker/common/baseProcessor";

@Processor("network")
export class NetworkSnapshotProcessor extends BaseProcessor {
  constructor(
    @InjectQueue("alchemy") private readonly alchemyQueue: Queue,
    @InjectQueue("covalent") private readonly covalentQueue: Queue,
    @InjectQueue("opensea") private readonly openseaQueue: Queue,
    @InjectQueue("poap") private readonly poapQueue: Queue,
    @InjectQueue("snapshot") private readonly snapshotQueue: Queue,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    readonly logger: LoggerService,
  ) {
    super();
  }

  @Process("snapshot")
  async handleSnapshot(job: Job) {
    this.logger.log(
      `Processing ${NetworkSnapshotProcessor.name}:::${job.id} ${job.data.spaceId} ${job.data.networkId}`,
    );
    this.logger.log(`Job: ${JSON.stringify(job)}`);
    const result: SnapshotVoters = await fetchSnapshotVoters(
      job.data.spaceId,
      15,
    );

    result.votes.forEach(async (vote, i) => {
      const castedAddress = castAddress(vote.voter);
      this.alchemyQueue.add(
        "address",
        {
          address: castedAddress,
          networkId: job.data.networkId,
        },
        {
          attempts: 3,
          backoff: 300,
          lifo: job.opts.lifo && i < 4 ? true : false,
        },
      );
      this.covalentQueue.add(
        "address",
        {
          address: castedAddress,
          networkId: job.data.networkId,
        },
        {
          attempts: 3,
          backoff: 300,
          lifo: job.opts.lifo && i < 4 ? true : false,
        },
      );
      this.openseaQueue.add(
        "address",
        {
          address: castedAddress,
          networkId: job.data.networkId,
        },
        {
          attempts: 3,
          backoff: 300,
          lifo: job.opts.lifo && i < 4 ? true : false,
        },
      );
      this.poapQueue.add(
        "address",
        {
          address: castedAddress,
          networkId: job.data.networkId,
        },
        {
          attempts: 3,
          backoff: 300,
          lifo: job.opts.lifo && i < 4 ? true : false,
        },
      );
      this.snapshotQueue.add(
        "address",
        {
          address: castedAddress,
          networkId: job.data.networkId,
        },
        {
          attempts: 3,
          backoff: 300,
          lifo: job.opts.lifo && i < 4 ? true : false,
        },
      );
    });
  }
}
