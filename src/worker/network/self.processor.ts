import { Process, Processor, InjectQueue } from "@nestjs/bull";
import { Inject } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import type { Job, Queue } from "bull";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { castAddress } from "@lightdotso/api/utils/castAddress";
import { BaseProcessor } from "@lightdotso/api/worker/common/baseProcessor";

@Processor("network")
export class NetworkSelfProcessor extends BaseProcessor {
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

  @Process("self")
  async handleSnapshot(job: Job) {
    this.logger.log(
      `Processing ${NetworkSelfProcessor.name}:::${job.id} ${job.data.address} ${job.data.networkId}`,
    );
    this.logger.log(`Job: ${JSON.stringify(job)}`);

    const castedAddress = castAddress(job.data.address);

    this.alchemyQueue.add(
      "address",
      {
        address: castedAddress,
        networkId: job.data.networkId,
      },
      {
        attempts: 3,
        backoff: 300,
        lifo: true,
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
        lifo: true,
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
        lifo: true,
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
        lifo: true,
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
        lifo: true,
      },
    );
  }
}
