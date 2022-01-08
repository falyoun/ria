import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FindOptions } from 'sequelize';
import {
  InactiveUserException,
  SamePasswordException,
  UnverifiedUserException,
} from '../exceptions';
import {
  ChangePasswordDto,
  ForgotPasswordRequestDto,
  LoginResponseDto,
} from '../dtos';
import { ConfigService } from '@nestjs/config';
import {
  AccountNotFoundException,
  BadLoginCredentialsException,
  CreateUserDto,
  UserAlreadyExistsException,
  User,
} from '@app/user';
import { LoginDto } from '../dtos/login.dto';
import { SpaAuthService } from '@app/spa';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly configService: ConfigService,
    private readonly spaAuthService: SpaAuthService,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }
  async findUser(findOptions: FindOptions): Promise<User> {
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
    await this.createUser(createUserDto);
    return {
      message:
        'Signed up successfully, please wait until your request is approved by admin',
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
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
      user,
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
