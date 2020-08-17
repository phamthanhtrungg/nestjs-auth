import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configSerice: ConfigService) => ({
        dialect: 'postgres',
        host: configSerice.get<string>('DB_HOST'),
        port: configSerice.get<number>('DB_PORT'),
        username: configSerice.get<string>('DB_USERNAME'),
        password: configSerice.get<string>('DB_PASSWORD'),
        database: configSerice.get<string>('DB'),
        synchronize: true,
        logging: true,
        autoLoadModels: true,
        dialectOptions:
          configSerice.get<string>('NODE_ENV') === 'production'
            ? {
                ssl: {
                  require: true,
                  rejectUnauthorized: false,
                },
              }
            : {},
        sync: { alter: true, },
        models: [User],
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
