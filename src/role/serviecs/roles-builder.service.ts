import { Injectable } from '@nestjs/common';
import { AppRole } from '@app/role/enums/app-role.enum';
import { JunoResources } from '@app/role/enums/grant-action.eum';

@Injectable()
export class RolesBuilderService {
  // private readonly rolesBuilder: RolesBuilder;
  // private createForSuperAdmin() {
  //   this.rolesBuilder
  //     .grant(AppRole.SUPER_ADMIN)
  //     .extend(AppRole.ADMIN)
  //     .createAny(JunoResources.ORGANIZATION)
  //     .updateAny(JunoResources.ORGANIZATION)
  //     .deleteAny(JunoResources.ORGANIZATION)
  //     .readAny(JunoResources.ORGANIZATION);
  // }
  // private createForAdmin() {
  //   this.rolesBuilder
  //     .grant(AppRole.ADMIN)
  //     .extend(AppRole.HR_MANAGER)
  //     .createAny(JunoResources.ACCOUNT)
  //     .deleteAny(JunoResources.ACCOUNT)
  //     .updateAny(JunoResources.ACCOUNT)
  //     .readAny(JunoResources.ACCOUNT);
  // }
  //
  // private createForManager() {
  //   this.rolesBuilder
  //     .grant(AppRole.HR_MANAGER)
  //     .extend(AppRole.MANAGER)
  //     .createAny(JunoResources.INVOICE)
  //     .readAny(JunoResources.INVOICE)
  //     .updateAny(JunoResources.INVOICE)
  //     .deleteAny(JunoResources.INVOICE);
  // }
  // private createForTeamMember() {
  //   this.rolesBuilder
  //     .grant(AppRole.MANAGER)
  //     .extend(AppRole.USER)
  //     .createOwn(JunoResources.INVOICE)
  //     .readOwn(JunoResources.INVOICE)
  //     .updateOwn(JunoResources.INVOICE)
  //     .deleteOwn(JunoResources.INVOICE);
  // }
  // private createForUser() {
  //   this.rolesBuilder
  //     .grant(AppRole.USER)
  //     .createAny(JunoResources.ORGANIZATION)
  //     .readOwn(JunoResources.ORGANIZATION)
  //     .createAny(JunoResources.ACCOUNT)
  //     .readOwn(JunoResources.ACCOUNT)
  //     .updateOwn(JunoResources.ACCOUNT)
  //     .deleteOwn(JunoResources.ACCOUNT);
  // }
  // constructor() {
  //   this.rolesBuilder = new RolesBuilder();
  //   this.createForUser();
  //   this.createForTeamMember();
  //   this.createForManager();
  //   this.createForAdmin();
  //   this.createForSuperAdmin();
  // }
  // get RolesBuilder() {
  //   return this.rolesBuilder;
  // }
}
