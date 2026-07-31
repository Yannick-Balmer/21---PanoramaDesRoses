import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { TeamsModule } from './teams/teams.module';
import { TournamentsModule } from './tournaments/tournaments.module';
import { MatchesModule } from './matches/matches.module';
import { PaymentsModule } from './payments/payments.module';
import { ResultsModule } from './results/results.module';
import { TeamMembersModule } from './team-members/team-members.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { StripeModule } from './stripe/stripe.module';
import { HealthModule } from './health/health.module';
import { LoggerModule } from './common/logger/logger.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { RequestLoggerMiddleware } from './common/middleware/request-logger/request-logger.middleware';
import { CsrfModule } from './common/csrf/csrf.module';
import { InquiriesModule } from './inquiries/inquiries.module';


const env = process.env.NODE_ENV 


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: [
      `env/.env.${env}`,
      'env/.env',
    ],
  }), UsersModule, TeamsModule, TournamentsModule, MatchesModule, PaymentsModule, ResultsModule, TeamMembersModule, PrismaModule, AuthModule, StripeModule, HealthModule, LoggerModule, CsrfModule, InquiriesModule],
  controllers: [AppController],
  providers: [AppService, 
    {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
    }
  ],
})


//export class AppModule {}
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    
    if (process.env.NODE_ENV !== 'production') {
        consumer
          .apply(RequestLoggerMiddleware)
          .forRoutes('*');
    }
  }
}

// export class AppModule implements NestModule {
//    configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(OriginCheckMiddleware)
//       .forRoutes('*'); // Appliqué à toutes les routes
//   }
// }
