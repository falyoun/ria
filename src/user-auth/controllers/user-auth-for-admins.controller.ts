import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { UserAuthService } from '../services';
import { ChangePasswordForUserDto } from '../dtos';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth For Admin')
@Controller('auth-for-admin')
export class UserAuthForAdminsController {
  constructor(private readonly userAuthService: UserAuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('/change-user-password')
  async changePasswordForUser(
    @Body() changePasswordForUserDto: ChangePasswordForUserDto,
  ) {}
}
