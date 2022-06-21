import { InjectQueue } from "@nestjs/bull";
import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import type { LoggerService } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Queue } from "bull";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Controller("queue")
export class QueueController {
  constructor(
    @InjectQueue("alchemy") private readonly alchemyQueue: Queue,
    @InjectQueue("covalent") private readonly covalentQueue: Queue,
    @InjectQueue("opensea") private readonly openseaQueue: Queue,
    @InjectQueue("poap") private readonly poapQueue: Queue,
    @InjectQueue("snapshot") private readonly snapshotQueue: Queue,
    @InjectQueue("timeline") private readonly timelineQueue: Queue,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    readonly logger: LoggerService,
  ) {}

  @UseGuards(AuthGuard("basic"))
  @Get("obliterate")
  async obliterate() {
    await Promise.all([
      this.alchemyQueue.obliterate({ force: true }),
      this.covalentQueue.obliterate({ force: true }),
      this.openseaQueue.obliterate({ force: true }),
      this.poapQueue.obliterate({ force: true }),
      this.snapshotQueue.obliterate({ force: true }),
      this.timelineQueue.obliterate({ force: true }),
    ]);
  }

  @UseGuards(AuthGuard("basic"))
  @Get("active")
  async active() {
    const [alchemy, covalent, opensea, poap, snapshot] = await Promise.all([
      this.alchemyQueue.getActiveCount(),
      this.covalentQueue.getActiveCount(),
      this.openseaQueue.getActiveCount(),
      this.poapQueue.getActiveCount(),
      this.snapshotQueue.getActiveCount(),
      this.timelineQueue.getActiveCount(),
    ]);
    return {
      alchemy: alchemy,
      covalent: covalent,
      opensea: opensea,
      poap: poap,
      snapshot: snapshot,
    };
  }

  @UseGuards(AuthGuard("basic"))
  @Get("completed")
  async completed() {
    const [alchemy, covalent, opensea, poap, snapshot, timeline] =
      await Promise.all([
        this.alchemyQueue.getCompletedCount(),
        this.covalentQueue.getCompletedCount(),
        this.openseaQueue.getCompletedCount(),
        this.poapQueue.getCompletedCount(),
        this.snapshotQueue.getCompletedCount(),
        this.timelineQueue.getCompletedCount(),
      ]);
    return {
      alchemy: alchemy,
      covalent: covalent,
      opensea: opensea,
      poap: poap,
      snapshot: snapshot,
      timeline: timeline,
    };
  }

  @UseGuards(AuthGuard("basic"))
  @Get("waiting")
  async waiting() {
    const [alchemy, covalent, opensea, poap, snapshot, timeline] =
      await Promise.all([
        this.alchemyQueue.getWaitingCount(),
        this.covalentQueue.getWaitingCount(),
        this.openseaQueue.getWaitingCount(),
        this.poapQueue.getWaitingCount(),
        this.snapshotQueue.getWaitingCount(),
        this.timelineQueue.getWaitingCount(),
      ]);
    return {
      alchemy: alchemy,
      covalent: covalent,
      opensea: opensea,
      poap: poap,
      snapshot: snapshot,
      timeline: timeline,
    };
  }
}
