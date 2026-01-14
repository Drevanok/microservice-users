import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { USER } from 'src/common/models/models';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(USER.name) private readonly model: Model<IUser>) {}

  async checkPassword(password: string, passwordDB: string): Promise<Boolean> {
    return await bcrypt.compare(password, passwordDB);
  }
  async findByUsername(username: string) {
    return await this.model.findOne({ username });
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  async createUser(userDto: UserDTO): Promise<IUser> {
    const { username, email, password } = userDto;

    const emailExist = await this.model.findOne({ email });
    if (emailExist) {
      throw new Error('Email already exists');
    }

    const userNameExist = await this.model.findOne({ username });
    if (userNameExist) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = new this.model({ ...userDto, password: hashedPassword });

    return await newUser.save();
  }

  async findAllUsers(): Promise<IUser[]> {
    const users = await this.model.find();

    if (!users || users.length === 0) {
      throw new Error('No users found');
    }

    return users;
  }

  async findOne(id: string): Promise<IUser> {
    const user = await this.model.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateUser(id: string, userDto: UserDTO): Promise<IUser> {
    const { username, email, password } = userDto;
    const hash = await this.hashPassword(password);

    const userExists = await this.model.findById(id);
    if (!userExists) {
      throw new Error('User not found');
    }

    //check if email or username already exists
    const emailExist = await this.model.findOne({ email });
    if (emailExist && emailExist.id !== id) {
      throw new Error('Email already exists');
    }

    const userNameExist = await this.model.findOne({ username });
    if (userNameExist && userNameExist.id !== id) {
      throw new Error('Username already exists');
    }

    const user = { ...userDto, password: hash };
    const userUpdate = await this.model.findByIdAndUpdate(id, user, {
      new: true,
    });

    if (!userUpdate) {
      throw new HttpException('Error updating user', HttpStatus.NOT_FOUND);
    }

    return userUpdate;
  }

  async deleteUser(id: string) {
    const user = await this.model.findByIdAndDelete(id);
    if (!user) {
      throw new Error('User not found');
    }

    return { status: HttpStatus.OK, message: 'User deleted successfully' };
  }
}
