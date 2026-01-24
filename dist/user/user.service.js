"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const microservices_1 = require("@nestjs/microservices");
const bcrypt = __importStar(require("bcrypt"));
const models_1 = require("../common/models/models");
let UserService = class UserService {
    model;
    constructor(model) {
        this.model = model;
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    async checkPassword(password, passwordDB) {
        return bcrypt.compare(password, passwordDB);
    }
    async findByUsername(username) {
        return this.model.findOne({ username });
    }
    async createUser(userDto) {
        const { username, email, password } = userDto;
        const emailExist = await this.model.findOne({ email });
        if (emailExist) {
            throw new microservices_1.RpcException({
                message: 'Email already exists',
                statusCode: 409,
            });
        }
        const userNameExist = await this.model.findOne({ username });
        if (userNameExist) {
            throw new microservices_1.RpcException({
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
    async findAllUsers() {
        return this.model.find();
    }
    async findOne(id) {
        const user = await this.model.findById(id);
        if (!user) {
            throw new microservices_1.RpcException({
                message: 'User not found',
                statusCode: 404,
            });
        }
        return user;
    }
    async updateUser(id, userDto) {
        const { username, email, password } = userDto;
        const userExists = await this.model.findById(id);
        if (!userExists) {
            throw new microservices_1.RpcException({
                message: 'User not found',
                statusCode: 404,
            });
        }
        const emailExist = await this.model.findOne({ email });
        if (emailExist && emailExist._id.toString() !== id) {
            throw new microservices_1.RpcException({
                message: 'Email already exists',
                statusCode: 409,
            });
        }
        const userNameExist = await this.model.findOne({ username });
        if (userNameExist && userNameExist._id.toString() !== id) {
            throw new microservices_1.RpcException({
                message: 'Username already exists',
                statusCode: 409,
            });
        }
        const hashedPassword = password
            ? await this.hashPassword(password)
            : userExists.password;
        const updatedUser = await this.model.findByIdAndUpdate(id, {
            ...userDto,
            password: hashedPassword,
        }, { new: true });
        if (!updatedUser) {
            throw new microservices_1.RpcException({
                message: 'Error updating user',
                statusCode: 400,
            });
        }
        return updatedUser;
    }
    async deleteUser(id) {
        const user = await this.model.findByIdAndDelete(id);
        if (!user) {
            throw new microservices_1.RpcException({
                message: 'User not found',
                statusCode: 404,
            });
        }
        return {
            statusCode: 200,
            message: 'User deleted successfully',
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(models_1.USER.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserService);
//# sourceMappingURL=user.service.js.map