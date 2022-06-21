import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";

import { NetworkCyberconnectProcessor } from "./cyberconnect.processor";
import { NetworkController } from "./network.controller";
import { NetworkPoapProcessor } from "./poap.processor";
import { NetworkSelfProcessor } from "./self.processor";
import { NetworkSnapshotProcessor } from "./snapshot.processor";

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
    ),
  ],
  controllers: [NetworkController],
  providers: [
    NetworkCyberconnectProcessor,
    NetworkPoapProcessor,
    NetworkSelfProcessor,
    NetworkSnapshotProcessor,
  ],
})
export class NetworkModule {}
