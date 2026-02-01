import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update.user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(userDto: UserDTO): Promise<import("../common/interfaces/user.interface").IUser>;
    findAllUsers(): Promise<import("../common/interfaces/user.interface").IUser[]>;
    findOne(id: string): Promise<import("../common/interfaces/user.interface").IUser>;
    updateUser(payload: UpdateUserDto & {
        id: string;
    }): Promise<import("../common/interfaces/user.interface").IUser>;
    deleteUser(id: string): Promise<{
        statusCode: number;
        message: string;
    }>;
    validateUser(payload: any): Promise<import("../common/interfaces/user.interface").IUser | null>;
}
