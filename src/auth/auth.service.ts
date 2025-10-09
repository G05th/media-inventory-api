// auth.service.ts
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { Types } from "mongoose";
import { UserDocument } from "../user/schemas/user.schema";
import { UserService } from "../user/user.service";

type SafeUser = Omit<UserDocument, "password"> & {
  _id: Types.ObjectId | string;
};

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<SafeUser | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) return null;

    const matches = await bcrypt.compare(pass, user.password);
    if (!matches) return null;

    const plain = user.toJSON() as Record<string, unknown>;
    delete plain.password;
    return plain as SafeUser;
  }

  login(user: { email: string; _id: unknown }): { access_token: string } {
    const sub = this.normalizeIdToString(user._id);
    const payload = { email: user.email, sub };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private normalizeIdToString(id: unknown): string {
    if (typeof id === "string") return id;

    if (id && typeof (id as { toString?: unknown }).toString === "function") {
      return (id as { toString: () => string }).toString();
    }

    throw new Error("Invalid user id");
  }
}
