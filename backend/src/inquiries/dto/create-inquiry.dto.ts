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
import { INQUIRY_SOURCES, InquirySource } from '../inquiry-source';

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
  @Transform(({ value }) => String(value).trim())
  phone?: string;

  @IsIn(['Les deux bâtiments', 'Bâtiment Héritage', 'Bâtiment Horizon'])
  interest: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(({ value }) => String(value).trim())
  message?: string;

  @IsIn(INQUIRY_SOURCES)
  source: InquirySource;

  @IsBooleanString()
  consent: string;

  // Honeypot : doit toujours rester vide.
  @IsOptional()
  @IsString()
  @MaxLength(0)
  website?: string;
}
