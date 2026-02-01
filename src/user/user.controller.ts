import { Controller } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { UserMSG } from '../common/constants';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UpdateUserDto } from './dto/update.user.dto';

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
  updateUser(@Payload() payload: UpdateUserDto & { id: string }) {
    const { id, ...userDto } = payload;
    return this.userService.updateUser(id, userDto);
  }

  @MessagePattern(UserMSG.DELETE)
  deleteUser(@Payload() id: string) {
    return this.userService.deleteUser(id);
  }

  @MessagePattern(UserMSG.VALID_USER)
  async validateUser(@Payload() payload) {
    const user = await this.userService.findByUsername(payload.username);
    if (!user) return null;

    const isValidPass = await this.userService.checkPassword(
      payload.password,
      user.password,
    );

    if (user && isValidPass) return user;

    return null;
  }
}
