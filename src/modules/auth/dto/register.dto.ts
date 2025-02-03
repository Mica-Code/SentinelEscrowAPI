import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, MaxDate, MinDate, MinLength } from "class-validator";


export enum Gender {
    MALE = 'male',
    FEMALE = 'female'
}

export class RegisterDto {
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsStrongPassword()
    @ApiProperty()
    password: string;

    @IsString()
    @MinLength(3)
    @ApiProperty()
    fullname: string;

    @IsPhoneNumber()
    @ApiProperty()
    phone: string;

    @IsString()
    @IsEnum(Gender)
    @ApiProperty({ enum: Gender })
    gender: string;

    @IsNotEmpty()
    @Type(() => Date) // Ensures the input is transformed into a Date object
    @IsDate({ message: 'Date of birth must be a valid date' }) // Ensures it's a valid Date
    @MinDate(new Date('1900-01-01'), { message: 'Date of birth must be after 1900' }) // Minimum date
    @MaxDate(new Date(), { message: 'Date of birth cannot be in the future' }) // No future dates
    @IsOptional()
    @ApiPropertyOptional({default: '2000-01-01'})
    dateOfBirth?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    referralCode?: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    marketingSource: string;
}
