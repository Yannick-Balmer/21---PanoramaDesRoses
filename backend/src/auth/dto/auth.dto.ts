import { IsDefined, IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsDefined({ message: "L'email est obligatoire" })
  @IsEmail({}, { message: 'Email invalide' })
  email!: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password!: string;
}

export class RegisterDto {
  @IsEmail({}, { message: 'Email invalide' })
  email!: string;

  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(10, {
    message: 'Le mot de passe doit contenir au moins 10 caractères',
  })
  password!: string;
}
