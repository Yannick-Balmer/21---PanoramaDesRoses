import { Transform } from 'class-transformer';
import {
  IsBooleanString,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateInquiryDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => String(value).trim())
  name: string;

  @IsEmail()
  @MaxLength(160)
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsIn(['Les deux bâtiments', 'Bâtiment Héritage', 'Bâtiment Horizon'])
  interest: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  message?: string;

  @IsBooleanString()
  consent: string;

  @IsOptional()
  @IsString()
  @MaxLength(0)
  website?: string;
}
