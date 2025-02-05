import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { EscrowRole } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";


export class EscrowProductsDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsNumber()
    @Min(0)
    @ApiProperty()
    unitPrice: number;

    @IsInt()
    @Min(0)
    @ApiProperty()
    quantity: number;
}

export class CreateEscrowDto {
    @IsEnum(EscrowRole)
    @ApiProperty({enum: EscrowRole})
    role: EscrowRole;

    @IsArray()
    @ValidateNested({each: true})
    @Type(() => EscrowProductsDto)
    @ApiProperty({type: [EscrowProductsDto]})
    products: EscrowProductsDto[];

    @IsDateString()
    @ApiProperty({type: 'string', format: 'date'})
    deliveryDate: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    notes?: string;
}