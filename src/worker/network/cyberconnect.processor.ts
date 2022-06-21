import { fetchCyberconnectFollowings } from "@lightdotso/services";
import type { CyberConnectFollowings } from "@lightdotso/types";
import { Process, Processor, InjectQueue } from "@nestjs/bull";
import { Inject } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import type { Job, Queue } from "bull";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

import { castAddress } from "@lightdotso/api/utils/castAddress";
import { BaseProcessor } from "@lightdotso/api/worker/common/baseProcessor";

@Processor("network")
export class NetworkCyberconnectProcessor extends BaseProcessor {
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

  @Process("cyberconnect")
  async handleTranscode(job: Job) {
    const castedAddress = castAddress(job.data.address);
    this.logger.log(
      `Processing ${NetworkCyberconnectProcessor.name}:::${job.id} ${castedAddress} ${job.data.networkId}`,
    );
    this.logger.log(`Job: ${JSON.stringify(job)}`);

    const result: CyberConnectFollowings = await fetchCyberconnectFollowings(
      castedAddress,
      30,
    );

    result.identity.followings.list.forEach(async (following, i) => {
      const castedAddress = castAddress(following.address);
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
