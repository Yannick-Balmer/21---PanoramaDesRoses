import { IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateStripeDto {
  @IsNumber()
  @IsNotEmpty()
  @Min(100)
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  tournamentId: number;

  @IsNumber() // Doit être l'ID de l'enregistrement créé dans votre DB
  @IsNotEmpty()
  dbPaymentId: number; 
}