import { Model } from 'mongoose';
import { UserDTO } from './dto/user.dto';
import { IUser } from 'src/common/interfaces/user.interface';
import { UpdateUserDto } from './dto/update.user.dto';
export declare class UserService {
    private readonly model;
    constructor(model: Model<IUser>);
    hashPassword(password: string): Promise<string>;
    checkPassword(password: string, passwordDB: string): Promise<boolean>;
    findByUsername(username: string): Promise<IUser | null>;
    createUser(userDto: UserDTO): Promise<IUser>;
    findAllUsers(): Promise<IUser[]>;
    findOne(id: string): Promise<IUser>;
    updateUser(id: string, userDto: UpdateUserDto): Promise<IUser>;
    deleteUser(id: string): Promise<{
        statusCode: number;
        message: string;
    }>;
}
