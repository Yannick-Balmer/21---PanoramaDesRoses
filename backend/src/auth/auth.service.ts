import { ConflictException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService,  private jwtService: JwtService,) {}

  async signIn(email: string, password: string): Promise<any> {
    if (!email || !password) {
        throw new UnauthorizedException('Email ou mot de passe manquant');
    }
    
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
    }
    
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new UnauthorizedException('Email ou mot de passe incorrect');
    }

    const payload = {
        sub: user.id,
        role: user.role,
        email: user.email,
    };
    const token = await this.jwtService.signAsync(payload);

    return {
        access_token: token,
        user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        },
    };
  }

  async signup(email: string, password: string): Promise<any> {
    const isExist = await this.usersService.findOneByEmail(email);
    if (isExist) {
        return await this.signIn(email, password);
    } else {

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await this.usersService.create({
          email,
          passwordHash,
        });

        const payload = {
          sub: user.id,
          role: user.role,
          email: user.email,
        };

        const token = await this.jwtService.signAsync(payload);

        return {
          access_token: token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        };
  }
  }
}
