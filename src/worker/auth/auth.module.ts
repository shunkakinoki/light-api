import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";

import { BasicStrategy } from "./auth.strategy";

@Module({
  imports: [PassportModule, ConfigModule],
  providers: [BasicStrategy],
})
export class AuthModule {}
