import { Module } from "@nestjs/common";

import { FourbyteService } from "./seeders/fourbyte.service";
import { TintinService } from "./seeders/tintin.service";
import { TasksService } from "./services/tasks.service";

@Module({
  imports: [],
  providers: [FourbyteService, TintinService, TasksService],
})
export class TaskModule {}
