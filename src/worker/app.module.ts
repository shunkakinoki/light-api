import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";
import { BullModule } from "@nestjs/bull";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

import { SentryModule } from "@ntegral/nestjs-sentry";

import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from "nest-winston";

import * as winston from "winston";

import { AlchemyModule } from "@lightdotso/api/worker/alchemy/alchemy.module";
import { AppController } from "@lightdotso/api/worker/app.controller";
import { AppService } from "@lightdotso/api/worker/app.service";
import { AuthModule } from "@lightdotso/api/worker/auth/auth.module";
import { BullBoardModule } from "@lightdotso/api/worker/bull/bull.module";
import { CovalentModule } from "@lightdotso/api/worker/covalent/covalent.module";
import { HealthModule } from "@lightdotso/api/worker/health/health.module";
import { NetworkModule } from "@lightdotso/api/worker/network/network.module";
import { OpenseaModule } from "@lightdotso/api/worker/opensea/opensea.module";
import { PoapModule } from "@lightdotso/api/worker/poap/poap.module";
import { QueueModule } from "@lightdotso/api/worker/queue/queue.module";
import { SnapshotModule } from "@lightdotso/api/worker/snapshot/snapshot.module";
import { TaskModule } from "@lightdotso/api/worker/task/task.module";
import { TimelineModule } from "@lightdotso/api/worker/timeline/timeline.module";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: `.env.local` }),
    SentryModule.forRoot({
      dsn: process.env.SENTRY_DSN,
      debug: true,
      environment: "production",
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike(),
          ),
        }),
        new LogtailTransport(new Logtail(process.env.LOGTAIL_WORKER_KEY)),
      ],
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.UPSTASH_REST_API_DOMAIN,
        port: parseInt(
          process.env.UPSTASH_REST_API_DOMAIN.replace(/[^0-9]/g, ""),
        ),
        password: process.env.UPSTASH_REST_API_PASSWORD,
        tls: {},
      },
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    BullBoardModule,
    HealthModule,
    NetworkModule,
    AlchemyModule,
    OpenseaModule,
    PoapModule,
    QueueModule,
    SnapshotModule,
    CovalentModule,
    TimelineModule,
    TaskModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
