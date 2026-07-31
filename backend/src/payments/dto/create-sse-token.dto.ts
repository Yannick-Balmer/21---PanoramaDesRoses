import { IsInt, IsPositive } from 'class-validator';

export class CreateSseTokenDto {
  @IsInt()
  @IsPositive()
  paymentId: number;
}