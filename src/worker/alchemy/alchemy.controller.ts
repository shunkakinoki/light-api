import { InjectQueue } from "@nestjs/bull";
import { Controller, Get, Param } from "@nestjs/common";
import type { Queue } from "bull";

import { castAddress } from "@lightdotso/api/utils/castAddress";

@Controller("alchemy")
export class AlchemyController {
  constructor(@InjectQueue("alchemy") private readonly alchemyQueue: Queue) {}

  @Get("/address/:address")
  async transcode(@Param("address") address: string) {
    await this.alchemyQueue.add("address", {
      address: castAddress(address),
    });
  }
}
