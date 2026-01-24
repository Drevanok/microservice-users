import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { UpdateUserMessage } from './dto/update.user.message.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    createUser(userDto: UserDTO): Promise<import("../common/interfaces/user.interface").IUser>;
    findAllUsers(): Promise<import("../common/interfaces/user.interface").IUser[]>;
    findOne(id: string): Promise<import("../common/interfaces/user.interface").IUser>;
    updateUser(payload: UpdateUserMessage): Promise<import("../common/interfaces/user.interface").IUser>;
    deleteUser(id: string): Promise<{
        statusCode: number;
        message: string;
    }>;
}
