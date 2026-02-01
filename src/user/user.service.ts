import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

import { UserDTO } from './dto/user.dto';
import { IUser } from '../common/interfaces/user.interface';
import { USER } from '../common/models/models';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(USER.name)
    private readonly model: Model<IUser>,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async checkPassword(password: string, passwordDB: string): Promise<boolean> {
    return bcrypt.compare(password, passwordDB);
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return this.model.findOne({ username });
  }


  async createUser(userDto: UserDTO): Promise<IUser> {
    const { username, email, password } = userDto;

    const emailExist = await this.model.findOne({ email });
    if (emailExist) {
      throw new RpcException({
        message: 'Email already exists',
        statusCode: 409,
      });
    }

    const userNameExist = await this.model.findOne({ username });
    if (userNameExist) {
      throw new RpcException({
        message: 'Username already exists',
        statusCode: 409,
      });
    }

    const hashedPassword = await this.hashPassword(password);
    const newUser = new this.model({
      ...userDto,
      password: hashedPassword,
    });

    return newUser.save();
  }

  async findAllUsers(): Promise<IUser[]> {
    return this.model.find();
  }

  async findOne(id: string): Promise<IUser> {
    const user = await this.model.findById(id);

    if (!user) {
      throw new RpcException({
        message: 'User not found',
        statusCode: 404,
      });
    }

    return user;
  }

  async updateUser(id: string, userDto: UpdateUserDto): Promise<IUser> {
    const { username, email, password } = userDto;

    const userExists = await this.model.findById(id);
    if (!userExists) {
      throw new RpcException({
        message: 'User not found',
        statusCode: 404,
      });
    }

    const emailExist = await this.model.findOne({ email });
    if (emailExist && emailExist._id.toString() !== id) {
      throw new RpcException({
        message: 'Email already exists',
        statusCode: 409,
      });
    }

    const userNameExist = await this.model.findOne({ username });
    if (userNameExist && userNameExist._id.toString() !== id) {
      throw new RpcException({
        message: 'Username already exists',
        statusCode: 409,
      });
    }

    const hashedPassword = password
      ? await this.hashPassword(password)
      : userExists.password;

    const updatedUser = await this.model.findByIdAndUpdate(
      id,
      {
        ...userDto,
        password: hashedPassword,
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new RpcException({
        message: 'Error updating user',
        statusCode: 400,
      });
    }

    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await this.model.findByIdAndDelete(id);

    if (!user) {
      throw new RpcException({
        message: 'User not found',
        statusCode: 404,
      });
    }

    return {
      statusCode: 200,
      message: 'User deleted successfully',
    };
  }
}
