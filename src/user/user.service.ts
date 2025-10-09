import { ConflictException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { LoginDto } from "../auth/dto/login.dto";
import { User, UserDocument } from "./schemas/user.schema";

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModule: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModule.findOne({ email }).select("+password").exec();
  }

  async create(createUserDto: LoginDto): Promise<UserDocument> {
    const existingUser = await this.findByEmail(createUserDto.email);

    if (existingUser) {
      throw new ConflictException("O email já está registrado");
    }

    const createUser = new this.userModule(createUserDto);
    return createUser.save();
  }
}
