import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleService } from './role.service';
import { UserRole } from '../models';
import { CreateUserRoleDto } from '../dtos';
import { CreateOptions, FindOptions } from 'sequelize';
import { firstValueFrom } from 'rxjs';
import {
  RolesNotLoadedCorrectlyException,
  UserDoesNotOwnTheRoleException,
  UserOwnsTheRoleException,
} from '../exceptions';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectModel(UserRole)
    private readonly userRole: typeof UserRole,
    private readonly roleService: RoleService,
  ) {}

  async findOne(findOptions: FindOptions<UserRole>) {
    const record = await this.userRole.findOne(findOptions);
    if (!record) {
      throw new UserDoesNotOwnTheRoleException();
    }
    return record;
  }
  async checkIfRoleAssignedToUser(findOptions: FindOptions<UserRole>) {
    try {
      await this.findOne(findOptions);
      throw new UserOwnsTheRoleException();
    } catch (e) {
      if (e instanceof UserDoesNotOwnTheRoleException) {
        return false;
      }
      throw e;
    }
  }
  async createUserRole(
    createUserRoleDto: CreateUserRoleDto,
    options?: CreateOptions,
  ) {
    const riaRoles = await firstValueFrom(
      this.roleService.roleReplaySubject.asObservable(),
    );
    if (!riaRoles || riaRoles.length < 1) {
      throw new RolesNotLoadedCorrectlyException();
    }
    const role = riaRoles.filter(
      (jr) => jr.name === createUserRoleDto.requiredRole,
    )[0];
    const userHasRequiredRole = await this.checkIfRoleAssignedToUser({
      where: {
        userId: createUserRoleDto.userId,
        roleId: role.id,
      },
    });
    if (!userHasRequiredRole) {
      return this.userRole.create(
        {
          userId: createUserRoleDto.userId,
          roleId: role.id,
        },
        options,
      );
    }
  }
}
