import { InjectQueue } from "@nestjs/bull";
import { Controller, Get, Param } from "@nestjs/common";
import type { Queue } from "bull";

import { castAddress } from "@lightdotso/api/utils/castAddress";

@Controller("snapshot")
export class SnapshotController {
  constructor(@InjectQueue("snapshot") private readonly snapshotQueue: Queue) {}

  @Get("/address/:address")
  async transcode(@Param("address") address: string) {
    await this.snapshotQueue.add("address", {
      address: castAddress(address),
    });
  }
}
