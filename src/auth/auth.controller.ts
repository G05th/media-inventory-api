import { Body, Controller, Post, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post("register")
  async register(@Body() loginDto: LoginDto) {
    const user = await this.userService.create(loginDto);

    return this.authService.login(user);
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      throw new UnauthorizedException("Credenciais Inválidas");
    }

    return this.authService.login(user);
  }
}
