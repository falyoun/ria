import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SpaAuthConstants, SpaAuthOptions, StrategiesNames } from '../shared';
import { extractWsJWTFromCookies } from '../extractors';

@Injectable()
export class SocketJwtStrategy extends PassportStrategy(
  Strategy,
  StrategiesNames.ALPHA_WS_JWT,
) {
  constructor(
    @Inject(SpaAuthConstants.SPA_AUTH_MODULE_OPTIONS)
    public spaModuleOptions: SpaAuthOptions,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        extractWsJWTFromCookies,
        // ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: spaModuleOptions.useAccessToken.jwtAccessSecretKey,
    });
  }

  async validate(payload: { id: number; email: string }): Promise<any> {
    return null;
  }
}
