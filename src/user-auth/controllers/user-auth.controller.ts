import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from '@app/user-auth/dtos/login-response.dto';
import { UserAuthService } from '@app/user-auth/services/user-auth.service';
import { SpaAuthService, TokensDto } from '@app/spa-authentication';
import { ApiRiaDto } from '@app/shared/dtos/ria-response.dto';
import { CreateUserDto } from '@app/user/dtos/create-user.dto';
import { MessageResponseDto } from '@app/shared/dtos/message-response.dto';
import { GenerateRefreshTokenDto } from '@app/user-auth/dtos/generate-refresh-token.dto';
import { ChangePasswordDto } from '@app/user-auth/dtos/change-password.dto';
import { ForgotPasswordRequestDto } from '@app/user-auth/dtos/forgot-password-request.dto';
import { MalformedJwtPayload } from '@app/user-auth/exceptions/exceptions';

@ApiExtraModels(LoginResponseDto)
@ApiTags('Auth')
@Controller('auth')
export class UserAuthController {
  constructor(
    private readonly userAuthService: UserAuthService,
    private readonly spaAuthService: SpaAuthService,
  ) {}

  @ApiRiaDto(LoginResponseDto)
  @Post('/login')
  async login(@Body() loginDto: LoginDto) {
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
  async refreshToken(
    @Query() generateRefreshTokenDto: GenerateRefreshTokenDto,
  ): Promise<TokensDto> {
    const payload = this.spaAuthService.verifyRefreshToken(
      generateRefreshTokenDto.token,
    );
    if (!payload.email && !payload.id) {
      throw new MalformedJwtPayload();
    }
    return this.spaAuthService.generateTokens({
      email: payload['email'],
      id: payload['id'],
    });
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
