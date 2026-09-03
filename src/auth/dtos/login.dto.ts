import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MinLength } from "class-validator"


export class LoginDto {

  @ApiProperty({
    description: "Email do usuário",
    example: "teste@main.com"
  })
  @IsEmail()
  email!: string
  
  @ApiProperty({
    description: "Senha do usuário",
    example: "12345",
    minLength: 6
  })
  @IsString()
  @MinLength(6)
  password!: string
}