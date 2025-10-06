import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsString, IsUrl } from "class-validator";

enum MediaType {
  VIDEO = "VIDEO",
  NEWS = "NEWS",
}
export class CreateMediaDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsUrl()
  url: string;

  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === "string" ? value.toUpperCase() : value,
  )
  @IsEnum(MediaType, {
    message: "type must be either VIDEO or NEWS",
  })
  type: MediaType;

  createdBy: string;
  updatedBy: string;
}
