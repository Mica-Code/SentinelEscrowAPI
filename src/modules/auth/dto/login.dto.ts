import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword } from "class-validator";

export class LoginDto {
    @IsEmail()
    @ApiProperty({ example: 'divine10646@gmail.com' })
    email: string;

    @IsStrongPassword()
    @ApiProperty({ example: 'User123@' })
    password: string;
}
