import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService){}
  getHello(): string {
    const dbUrl = this.configService.get<string>('DATABASE_URL');
    return 'Hello World! les amis du monde, Ca marche!';
    
  }
}
