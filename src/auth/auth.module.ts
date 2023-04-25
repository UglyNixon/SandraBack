import {forwardRef, Injectable, Module} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {UsersModule} from "../users/users.module";
import {JwtModule} from "@nestjs/jwt";
import {TokenService} from "./token.service";
import {SequelizeModule} from "@nestjs/sequelize";
import {Token} from "./token.model";
import { User } from 'src/users/users.model';
import {MailModule} from "../mail/mail.module";



@Module({
  providers: [AuthService,TokenService],
  controllers: [AuthController],
  imports:[
    MailModule,
    SequelizeModule.forFeature([Token,User]),
      forwardRef(()=>UsersModule),
      JwtModule.register({
      secret:process.env.PRIVATE_REFRESH_KEY || 'secret',
      signOptions:{
        expiresIn:'7d'
      }
    }),


  ],
  exports:[AuthService,JwtModule]

})
export class AuthModule {}