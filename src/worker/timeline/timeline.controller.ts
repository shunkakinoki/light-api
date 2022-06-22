import { InjectQueue } from "@nestjs/bull";
import { Controller, Get, Param } from "@nestjs/common";
import type { Queue } from "bull";

import { castAddress } from "@lightdotso/api/utils/castAddress";

@Controller("timeline")
export class TimelineController {
  constructor(@InjectQueue("timeline") private readonly timelineQueue: Queue) {}

  @Get("/queue/:address/:networkId")
  async transcode(
    @Param("address") address: string,
    @Param("networkId") networkId: string,
  ) {
    await this.timelineQueue.add("address", {
      address: castAddress(address),
      networkId: networkId,
    });
  }
}
