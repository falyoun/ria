import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from '../services';
import { CreateUserDto, UpdateUserDto, UserDto } from '../dtos';
import {
  ApiPaginatedDto,
  ApiRiaDto,
  SequelizePaginationDto,
} from '@app/shared';
import { ApiExtraModels, ApiTags } from '@nestjs/swagger';
@ApiExtraModels(UserDto, CreateUserDto, UpdateUserDto)
@ApiTags('User')
@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiRiaDto(UserDto)
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createOne(createUserDto);
  }
  @ApiPaginatedDto(UserDto)
  @Get()
  findAllUsers(@Query() query: SequelizePaginationDto) {
    return this.userService.findAll({}, query);
  }
  @ApiRiaDto(UserDto)
  @Get(':id')
  findUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne({
      where: {
        id,
      },
    });
  }
  @ApiRiaDto(UserDto)
  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateOne(
      {
        where: {
          id,
        },
      },
      updateUserDto,
    );
  }
}
