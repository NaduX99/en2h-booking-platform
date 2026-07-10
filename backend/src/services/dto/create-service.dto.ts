import {
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(1000)
    description: string;

    @IsNumber()
    @IsPositive()
    duration: number;

    @IsNumber({
        maxDecimalPlaces: 2,
    })
    @Min(0)
    price: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}