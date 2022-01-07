import { Injectable } from '@nestjs/common';
import { RolesBuilder } from 'nest-access-control';
import { AppRole, JunoResources } from '../enums';

@Injectable()
export class RolesBuilderService {
  private readonly rolesBuilder: RolesBuilder;
  private createForSuperAdmin() {
    this.rolesBuilder
      .grant(AppRole.SUPER_ADMIN)
      .extend(AppRole.ADMIN)
      .createAny(JunoResources.ORGANIZATION)
      .updateAny(JunoResources.ORGANIZATION)
      .deleteAny(JunoResources.ORGANIZATION)
      .readAny(JunoResources.ORGANIZATION);
  }
  private createForAdmin() {
    this.rolesBuilder
      .grant(AppRole.ADMIN)
      .extend(AppRole.TEAM_MEMBER)
      .createAny(JunoResources.ACCOUNT)
      .deleteAny(JunoResources.ACCOUNT)
      .updateAny(JunoResources.ACCOUNT)
      .readAny(JunoResources.ACCOUNT);
  }

  private createForManager() {
    this.rolesBuilder
      .grant(AppRole.MANAGER)
      .extend(AppRole.TEAM_MEMBER)
      .createAny(JunoResources.INVOICE)
      .readAny(JunoResources.INVOICE)
      .updateAny(JunoResources.INVOICE)
      .deleteAny(JunoResources.INVOICE);
  }
  private createForTeamMember() {
    this.rolesBuilder
      .grant(AppRole.TEAM_MEMBER)
      .extend('user')
      .createOwn(JunoResources.INVOICE)
      .readOwn(JunoResources.INVOICE)
      .updateOwn(JunoResources.INVOICE)
      .deleteOwn(JunoResources.INVOICE);
  }
  private createForUser() {
    this.rolesBuilder
      .grant('user')
      .createAny(JunoResources.ORGANIZATION)
      .readOwn(JunoResources.ORGANIZATION)
      .createAny(JunoResources.ACCOUNT)
      .readOwn(JunoResources.ACCOUNT)
      .updateOwn(JunoResources.ACCOUNT)
      .deleteOwn(JunoResources.ACCOUNT);
  }
  constructor() {
    this.rolesBuilder = new RolesBuilder();
    this.createForUser();
    this.createForTeamMember();
    this.createForManager();
    this.createForAdmin();
    this.createForSuperAdmin();
  }
  get RolesBuilder() {
    return this.rolesBuilder;
  }
}
