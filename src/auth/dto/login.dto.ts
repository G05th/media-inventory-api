import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsEmail({}, { message: "O email fornecido é incálido" })
  @IsNotEmpty({ message: "O email é obrigatório" })
  email: string;

  @IsString({ message: "A senha  deve ser uma string" })
  @IsNotEmpty({ message: "A senha é Obrigatória" })
  password: string;
}
