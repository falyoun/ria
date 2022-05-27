import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SpaAuthConstants, SpaAuthOptions, StrategiesNames } from '../shared';
import {
  UserAttributes,
  UserCreationAttributes,
} from '@app/user/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  StrategiesNames.ITE_JWT,
) {
  constructor(
    @Inject(SpaAuthConstants.SPA_AUTH_MODULE_OPTIONS)
    public spaModuleOptions: SpaAuthOptions,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // extractJWTFromCookies,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: spaModuleOptions.useAccessToken.jwtAccessSecretKey,
    });
  }

  async validate(payload: { id: number; email: string }): Promise<any> {
    const { sequelizeInstance, model } =
      this.spaModuleOptions.sequelizeConnection;
    const userCtor = sequelizeInstance.model<
      UserCreationAttributes,
      UserAttributes
    >(model);
    const user = await userCtor.scope('leaves').findOne({
      where: {
        id: payload.id,
        email: payload.email,
        isActive: true,
        isVerified: true,
      },
    });
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
