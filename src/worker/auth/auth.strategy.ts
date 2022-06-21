import { Injectable, UnauthorizedException } from "@nestjs/common";
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { BasicStrategy as Strategy } from "passport-http";

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      passReqToCallback: true,
    });
  }

  public validate = async (req, username, password): Promise<boolean> => {
    if (
      // this.configService.get<string>("HTTP_BASIC_USER") === username &&
      "test" === username &&
      "test" === password
      // this.configService.get<string>("HTTP_BASIC_PASS") === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  };
}
