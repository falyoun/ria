import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { UserAuthService } from '../services';
import { CreateUserDto } from '@app/user';
import { SpaAuthService, TokensDto } from '@app/spa';
import { MessageResponseDto } from '@app/shared';
import {
  ChangePasswordDto,
  ForgotPasswordRequestDto,
  LoginResponseDto,
} from '../dtos';
import { LoginDto } from '../dtos/login.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Auth')
@Controller('auth')
export class UserAuthController {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly spaAuthService: SpaAuthService,
  ) {}

  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.userAuthService.login(loginDto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/sign-up')
  async signUp(
    @Body() createUserDto: CreateUserDto,
  ): Promise<MessageResponseDto> {
    return this.userAuthService.signUp(createUserDto);
  }

  @Get('/refresh')
  async refreshToken(@Query('token') token: string): Promise<TokensDto> {
    const payload = this.spaAuthService.verifyRefreshToken(token);
    return this.spaAuthService.generateTokens(payload);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    await this.userAuthService.changePassword(changePasswordDto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('/query-to-change-password')
  async forgotPasswordRequest(
    @Body() forgotPasswordDto: ForgotPasswordRequestDto,
  ) {
    return this.userAuthService.queryAdminToChangePassword(forgotPasswordDto);
  }
}
