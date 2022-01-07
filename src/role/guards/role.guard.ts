import { AppRole, UserRole } from '@app/role';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { JwtAuthGuard } from '@app/spa';

export const RoleGuard = (...args: AppRole[]): Type<CanActivate> => {
  class RoleGuardMixin extends JwtAuthGuard {
    constructor() {
      super();
    }
    private isSuperAdmin(roles: UserRole[]) {
      const filteredRoles = roles.filter(
        (r) => r.role.name === AppRole.SUPER_ADMIN,
      );
      return filteredRoles && filteredRoles.length > 0;
    }
    private canAccessViaMatching(roles: UserRole[], args: AppRole[]) {
      if (args.includes(AppRole.SUPER_ADMIN) && this.isSuperAdmin(roles))
        return true;
      return !!roles.find((r) => {
        return args.includes(r.role.name);
      });
    }
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest();
      const user = request.user;
      const { associatedRoles } = user;
      return this.canAccessViaMatching(associatedRoles, args);
    }
  }
  return mixin(RoleGuardMixin);
};
