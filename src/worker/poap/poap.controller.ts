import { InjectQueue } from "@nestjs/bull";
import { Controller, Get, Param } from "@nestjs/common";
import type { Queue } from "bull";

import { castAddress } from "@lightdotso/api/utils/castAddress";

@Controller("poap")
export class PoapController {
  constructor(@InjectQueue("poap") private readonly poapQueue: Queue) {}

  @Get("/address/:address")
  async transcode(@Param("address") address: string) {
    await this.poapQueue.add("address", {
      address: castAddress(address),
    });
  }
}
