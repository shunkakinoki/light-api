import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/dist/src/queueAdapters/bull";
import { ExpressAdapter } from "@bull-board/express";
import { BullModule, InjectQueue } from "@nestjs/bull";
import type { NestModule, MiddlewareConsumer } from "@nestjs/common";
import { Module } from "@nestjs/common";
import type { Queue } from "bull";

@Module({
  imports: [
    BullModule.registerQueue(
      {
        name: "network",
        limiter: { max: 5, duration: 1000 },
      },
      {
        name: "alchemy",
        limiter: { max: 5, duration: 1000 },
      },
      {
        name: "covalent",
        limiter: { max: 5, duration: 1000 },
      },
      {
        name: "opensea",
        limiter: { max: 5, duration: 1000 },
      },
      {
        name: "poap",
        limiter: { max: 5, duration: 1000 },
      },
      {
        name: "snapshot",
        limiter: { max: 5, duration: 1000 },
      },
      {
        name: "timeline",
        limiter: { max: 5, duration: 1000 },
      },
    ),
  ],
})
export class BullBoardModule implements NestModule {
  public serverAdapter = new ExpressAdapter();

  constructor(
    @InjectQueue("network") private readonly networkQueue: Queue,
    @InjectQueue("alchemy") private readonly alchemyQueue: Queue,
    @InjectQueue("covalent") private readonly covalentQueue: Queue,
    @InjectQueue("opensea") private readonly openseaQueue: Queue,
    @InjectQueue("poap") private readonly poapQueue: Queue,
    @InjectQueue("snapshot") private readonly snapshotQueue: Queue,
    @InjectQueue("timeline") private readonly timelineQueue: Queue,
  ) {
    this.serverAdapter.setBasePath("/admin/queues");
    createBullBoard({
      queues: [
        new BullAdapter(this.networkQueue, { readOnlyMode: true }),
        new BullAdapter(this.alchemyQueue, { readOnlyMode: true }),
        new BullAdapter(this.covalentQueue, { readOnlyMode: true }),
        new BullAdapter(this.openseaQueue, { readOnlyMode: true }),
        new BullAdapter(this.poapQueue, { readOnlyMode: true }),
        new BullAdapter(this.snapshotQueue, { readOnlyMode: true }),
        new BullAdapter(this.timelineQueue, { readOnlyMode: true }),
      ],
      serverAdapter: this.serverAdapter,
    });
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(this.serverAdapter.getRouter()).forRoutes("/admin/queues");
  }
}
