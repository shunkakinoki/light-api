import { InjectQueue } from "@nestjs/bull";
import { Controller, Get, Param } from "@nestjs/common";
import type { Queue } from "bull";

import { castAddress } from "@lightdotso/api/utils/castAddress";

@Controller("opensea")
export class OpenseaController {
  constructor(@InjectQueue("opensea") private readonly openseaQueue: Queue) {}

  @Get("/address/:address")
  async transcode(@Param("address") address: string) {
    await this.openseaQueue.add("address", {
      address: castAddress(address),
    });
  }
}
