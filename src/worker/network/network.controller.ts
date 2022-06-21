import { InjectQueue } from "@nestjs/bull";
import { Controller, Get, Param } from "@nestjs/common";
import type { Queue } from "bull";

@Controller("network")
export class NetworkController {
  constructor(@InjectQueue("network") private readonly networkQueue: Queue) {}

  @Get("/cyberconnect/:address/:networkId")
  async cyberconnect(
    @Param("address") address: string,
    @Param("networkId") networkId: string,
  ) {
    await this.networkQueue.add("cyberconnect", {
      address: address,
      networkId: networkId,
    });
  }

  @Get("/poap/:eventId/:networkId")
  async poap(
    @Param("eventId") eventId: string,
    @Param("networkId") networkId: string,
  ) {
    await this.networkQueue.add("poap", {
      eventId: eventId,
      networkId: networkId,
    });
  }

  @Get("/snapshot/:spaceId/:networkId")
  async snapshot(
    @Param("spaceId") spaceId: string,
    @Param("networkId") networkId: string,
  ) {
    await this.networkQueue.add("snapshot", {
      spaceId: spaceId,
      networkId: networkId,
    });
  }
}
