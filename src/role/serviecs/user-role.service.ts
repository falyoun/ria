import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RoleService } from './role.service';
import { CreateOptions, FindOptions, Op, WhereOptions } from 'sequelize';
import { firstValueFrom } from 'rxjs';
import {
  RolesNotLoadedCorrectlyException,
  UserDoesNotOwnTheRoleException,
  UserOwnsTheRoleException,
} from '../exceptions';
import { UserRole } from '@app/role/models/user-role.model';
import { CreateUserRoleDto } from '@app/role/dtos/create-user-role.dto';
import { AppRole } from '@app/role/enums/app-role.enum';
import { FindManyUsersRolesDto } from '@app/role/dtos/find-many-users-roles.dto';
import { RiaUtils } from '@app/shared/utils';
import { User } from '@app/user/models/user.model';
import { CreateGrantDto } from '@app/role/dtos/grant/create-grant.dto';
import { Grant } from '@app/role/models/grant.model';
import { RevokeGrantDto } from '@app/role/dtos/revoke-grant.dto';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectModel(UserRole)
    private readonly userRole: typeof UserRole,
    private readonly roleService: RoleService,
    @InjectModel(Grant)
    private readonly grantModel: typeof Grant,
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
  async assignNewRoleToUser(userId: number, appRole: AppRole) {
    const riaRoles = await firstValueFrom(
      this.roleService.roleReplaySubject.asObservable(),
    );
    if (!riaRoles || riaRoles.length < 1) {
      throw new RolesNotLoadedCorrectlyException();
    }
    const role = riaRoles.filter((jr) => jr.name === appRole)[0];
    const userRoleEntity = await this.findOne({
      where: {
        userId: userId,
        roleId: role.id,
      },
    });
    if (!userRoleEntity) {
      return this.userRole.create({
        userId: userId,
        roleId: role.id,
      });
    }
    return userRoleEntity.update({
      roleId: role.id,
    });
  }

  async getAllUsersRoles(findManyUsersRolesDto: FindManyUsersRolesDto) {
    let whereOptions: WhereOptions<UserRole> = {};
    if (findManyUsersRolesDto.userIds) {
      whereOptions = {
        ...whereOptions,
        userId: {
          [Op.in]: findManyUsersRolesDto.userIds,
        },
      };
    }
    const findOptions: FindOptions<UserRole> = {
      where: whereOptions,
    };
    const count = await this.userRole.count(findOptions);
    RiaUtils.applyPagination(findOptions, findManyUsersRolesDto);
    return {
      data: await this.userRole.scope('user').findAll(findOptions),
      count,
    };
  }
  async addNewGrantToUserRole(createGrantDto: CreateGrantDto) {
    const userRole = await this.findOne({
      where: {
        userId: createGrantDto.userId,
        roleId: createGrantDto.roleId,
      },
    });
    const createdGrant = await this.grantModel.create({
      userRoleId: userRole.id,
      ...createGrantDto,
    });
    userRole.grants.push(createdGrant);
    return userRole;
  }

  async revokeGrant(revokeGrantDto: RevokeGrantDto) {
    const userRole = await this.findOne({
      where: {
        userId: revokeGrantDto.userId,
        roleId: revokeGrantDto.roleId,
      },
      include: [
        {
          association: 'grants',
          where: {
            id: revokeGrantDto.grantId,
          },
        },
      ],
    });
    const grant = await this.grantModel.findOne({
      where: {
        id: revokeGrantDto.grantId,
      },
    });
    await grant.destroy({ force: true });
    userRole.grants.splice(
      userRole.grants.findIndex((gr) => gr.id === revokeGrantDto.grantId),
      1,
    );
    return userRole;
  }
}
