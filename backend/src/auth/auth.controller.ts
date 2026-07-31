import { Body, Controller, Post, HttpCode, HttpStatus, Res } from '@nestjs/common';
  import { Response, Request } from 'express';
  import { AuthService } from './auth.service';
  import { LoginDto, RegisterDto } from './dto/auth.dto';

  @Controller('auth')
  export class AuthController {
    constructor(private authService: AuthService) {}
  
    @HttpCode(HttpStatus.OK)
    @Post('signin')
    async signIn(
      @Body() signInDto: LoginDto,
    ) {
        return await this.authService.signIn(
          signInDto.email,
          signInDto.password,
        );
    }
  
    @HttpCode(HttpStatus.OK)
    @Post('signup')
    async signUp(
      @Body() signUpDto: RegisterDto,
      @Res({ passthrough: true }) response: Response,
    ) {
      
        const result= await this.authService.signup(
          signUpDto.email,
          signUpDto.password,
        );
        if (result.access_token) {
          // Utiliser response.cookie() pour définir le cookie
          response.cookie('access_token', result.access_token, {
              httpOnly: true, // IMPORTANT : Empêche le JS d'accéder au cookie (sécurité XSS)
              secure: process.env.NODE_ENV === 'production', // IMPORTANT : N'envoyer qu'en HTTPS si en prod
              sameSite: "lax",
              maxAge: 7 * 24 * 60 * 60 * 1000, // Exemple : Durée de 7 jours en millisecondes
              path: '/',
          });
      }
      return result;
    }
  
    @HttpCode(HttpStatus.OK)
    @Post('logout')
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie('access_token', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
        });
        return { message: 'Déconnexion réussie' };
    }
  }
  