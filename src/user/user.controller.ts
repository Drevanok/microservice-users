import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { UserMSG } from 'src/common/constants';
import { MessagePattern, Payload } from '@nestjs/microservices';
import  { UpdateUserMessage } from './dto/update.user.message.dto';


@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern(UserMSG.CREATE)
  createUser(@Payload() userDto: UserDTO) {
    return this.userService.createUser(userDto);
  }

  @MessagePattern(UserMSG.FIND_ALL)
  findAllUsers() {
    return this.userService.findAllUsers();
  }

  @MessagePattern(UserMSG.FIND_ONE)
  findOne(@Payload() id: string) {
    return this.userService.findOne(id);
  }

  @MessagePattern(UserMSG.UPDATE)
  updateUser(@Payload() payload: UpdateUserMessage) {
    const { id, userDto } = payload;
    return this.userService.updateUser(id, userDto);
  }

  @MessagePattern(UserMSG.DELETE)
  deleteUser(@Payload('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
