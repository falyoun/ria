import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import { ConfigService } from '@nestjs/config';

import { LoginDto } from '../dtos/login.dto';
import { Sequelize } from 'sequelize-typescript';
import { User } from '@app/user/models/user.model';
import { SpaAuthService } from '@app/spa-authentication';
import { UserRoleService } from '@app/role/serviecs/user-role.service';
import {
  AccountNotFoundException,
  BadLoginCredentialsException,
  UserAlreadyExistsException,
} from '@app/user/exceptions';
import { AppRole } from '@app/role/enums/app-role.enum';
import { CreateUserDto } from '@app/user/dtos/create-user.dto';
import {
  InactiveUserException,
  SamePasswordException,
  UnverifiedUserException,
} from '@app/user-auth/exceptions/exceptions';
import { ChangePasswordDto } from '@app/user-auth/dtos/change-password.dto';
import { ForgotPasswordRequestDto } from '@app/user-auth/dtos/forgot-password-request.dto';

@Injectable()
export class UserAuthService implements OnApplicationBootstrap {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly configService: ConfigService,
    private readonly spaAuthService: SpaAuthService,
    private readonly sequelize: Sequelize,
    private readonly userRoleService: UserRoleService,
  ) {}

  private async createUserIfNotExist({
    email,
    firstName,
    lastName,
    password,
    role,
  }: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: AppRole;
  }) {
    try {
      await this.findUser({
        where: {
          email,
        },
      });
    } catch (e) {
      if (e instanceof AccountNotFoundException) {
        await this.sequelize.transaction(async (transaction) => {
          const superAdmin = await this.userModel.create({
            firstName,
            lastName,
            email,
            password,
            isActive: true,
            isVerified: true,
          });
          await this.userRoleService.createUserRole({
            userId: superAdmin.id,
            requiredRole: role,
          });
        });
      }
    }
  }
  async onApplicationBootstrap() {
    await this.createUserIfNotExist({
      email: 'super-admin@ria.com',
      password: 'ria@123',
      firstName: 'ria',
      lastName: 'ria',
      role: AppRole.SUPER_ADMIN,
    });
    await this.createUserIfNotExist({
      email: 'admin@ria.com',
      password: 'ria@123',
      firstName: 'Admin',
      lastName: 'admin',
      role: AppRole.ADMIN,
    });
    await this.createUserIfNotExist({
      email: 'hr-manager@ria.com',
      password: 'ria@123',
      firstName: 'Hr Manager',
      lastName: 'hr manager',
      role: AppRole.HR_MANAGER,
    });
    await this.createUserIfNotExist({
      email: 'manager@ria.com',
      password: 'ria@123',
      firstName: 'Manager',
      lastName: 'manager',
      role: AppRole.MANAGER,
    });

    await this.createUserIfNotExist({
      email: 'user@ria.com',
      password: 'ria@123',
      firstName: 'User',
      lastName: 'user',
      role: AppRole.USER,
    });
  }

  createUser(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }
  async findUser(findOptions: FindOptions<User>): Promise<User> {
    const user = await this.userModel.findOne(findOptions);
    if (!user) {
      throw new AccountNotFoundException();
    }
    if (!user.isVerified) {
      throw new UnverifiedUserException();
    }
    if (!user.isActive) {
      throw new InactiveUserException();
    }
    return user;
  }

  async signUp(createUserDto: CreateUserDto) {
    const { email } = createUserDto;
    const user = await this.userModel.findOne({
      where: {
        email,
      },
    });
    if (user) {
      throw new UserAlreadyExistsException();
    }
    return await this.sequelize.transaction(async (transaction) => {
      const createdUser = await this.createUser(createUserDto);
      await this.userRoleService.createUserRole({
        userId: createdUser.id,
        requiredRole: AppRole.USER,
      });
      return {
        message:
          'Signed up successfully, please wait until your request is approved by admin',
      };
    });
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.findUser({
      where: {
        email,
      },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'isActive',
        'isVerified',
        'password',
        'roles',
      ],
    });
    if (!(await user.isPasswordValid(password))) {
      throw new BadLoginCredentialsException();
    }
    const tokensDto = await this.spaAuthService.generateTokens({
      id: user.id,
      email: user.email,
    });
    return {
      ...user.toJSON(),
      ...tokensDto,
    };
  }

  async changePassword(changePasswordModel: ChangePasswordDto) {
    const { oldPassword, newPassword, email } = changePasswordModel;
    if (oldPassword === newPassword) {
      throw new SamePasswordException();
    }
    const user = await this.findUser({
      where: {
        email,
      },
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'isActive',
        'isVerified',
        'password',
        'roles',
      ],
    });
    if (!(await user.isPasswordValid(oldPassword))) {
      return;
    }
    user.set('password', newPassword);
    await user.save();
    return {
      message: 'Password changed successfully',
    };
  }

  async queryAdminToChangePassword(
    forgotPasswordModel: ForgotPasswordRequestDto,
  ) {
    const { email } = forgotPasswordModel;
    const user = await this.userModel.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new AccountNotFoundException();
    }
    // TODO (add this query to db)
    return {
      message: 'You request for changing password got delivered to admin',
    };
  }
}
