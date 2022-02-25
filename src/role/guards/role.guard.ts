import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { AppRole } from '@app/role/enums/app-role.enum';
import { JwtAuthGuard } from '@app/spa-authentication';

export const RoleGuard = (...args: AppRole[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    constructor() {
      super();
    }
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const { associatedRoles } = user;
      return !!associatedRoles.find((r) => {
        return args.includes(r.role.name);
      });
    }
  }
  return mixin(RoleGuardMixin);
};
