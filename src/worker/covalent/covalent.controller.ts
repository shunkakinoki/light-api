import { InjectQueue } from "@nestjs/bull";
import { Controller, Get, Param } from "@nestjs/common";
import type { Queue } from "bull";

import { castAddress } from "@lightdotso/api/utils/castAddress";

@Controller("covalent")
export class CovalentController {
  constructor(@InjectQueue("covalent") private readonly covalentQueue: Queue) {}

  @Get("/address/:address")
  async transcode(@Param("address") address: string) {
    await this.covalentQueue.add("address", {
      address: castAddress(address),
    });
  }
}
