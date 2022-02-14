import { InjectModel } from '@nestjs/sequelize';
import { User, UserService } from '@app/user';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { UserAuthService } from './user-auth.service';

@Injectable()
export class UserAuthForAdminService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    private readonly configService: ConfigService,
    private readonly userAuthService: UserAuthService,
    private readonly userService: UserService,
  ) {}

  async approveUserToJoinTheSystem(userId: number) {
    const user = await this.userService.findOne({
      where: {
        id: userId,
      },
    });
    return user.update({
      isVerified: true,
      isActive: true,
    });
  }
  async rejectUser(userId: number) {
    const user = await this.userService.findOne({
      where: {
        id: userId,
      },
    });

    await user.destroy();
    return {
      message: 'deleted',
    };
  }
}
