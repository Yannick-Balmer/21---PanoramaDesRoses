import { Role } from '@prisma/client';
import {
    IsNotEmpty,
    IsString,
    IsEmail,
    IsOptional,
    MinLength,
    IsEnum,
  } from 'class-validator';
  
  export class CreateUserDto {
    @IsNotEmpty({ message: "L'email est requis" })
    @IsEmail({}, { message: "L'email doit être valide" })
    email: string;

    @IsNotEmpty({ message: 'Le mot de passe est requis' })
    @MinLength(10, {
      message: 'Le mot de passe doit contenir au moins 10 caractères',
    })
    passwordHash: string;

    @IsOptional()
    @IsString({ message: 'Le nom doit être une chaîne de caractères' })
    name?: string;
  
    @IsOptional()
    @IsEnum(Role, { message: "Le rôle doit être USER, ORGANIZER" })
    role?: Role;
  }
  