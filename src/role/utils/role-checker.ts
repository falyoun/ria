import { User } from '@app/user/models/user.model';
import { AppRole } from '@app/role/enums/app-role.enum';

export const hasRole = (user: User, requiredRole: AppRole) =>
  user.roles.findIndex((v) => v === requiredRole) !== -1;
export const isSuperAdmin = (user: User) => hasRole(user, AppRole.SUPER_ADMIN);
export const isAdmin = (user: User) => hasRole(user, AppRole.ADMIN);
export const isHRManager = (user: User) => hasRole(user, AppRole.HR_MANAGER);
export const isManager = (user: User) => hasRole(user, AppRole.MANAGER);
export const isNormalUser = (user: User) => hasRole(user, AppRole.USER);
export const isUserInCoreTeam = (user: User) =>
  isSuperAdmin(user) || isAdmin(user);

export const isUserInManagementTeam = (user: User) =>
  isHRManager(user) || isManager(user);

export const isUserAndOnlyUser = (user: User) =>
  user.roles.every((v) => v === AppRole.USER);
