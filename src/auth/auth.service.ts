import {HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs'
import * as uuid from 'uuid'
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/user-login.dto';
import { UsersService } from 'src/users/users.service';
import { TokenService } from './token.service';
import {MailService} from "../mail/mail.service";
import { User } from 'src/users/users.model';
@Injectable()
export class AuthService {
    constructor(private userService:UsersService,
                private tokenService:TokenService,
                private mailService:MailService

    ) {}

    async login(userDto:LoginUserDto){
        const user = await this.validateUser(userDto)
        const tokens =  await this.tokenService.generateToken(user)
        await this.tokenService.saveToken(user.id,tokens.refreshToken)
        return {...tokens}
    }

    async registration(userDto:CreateUserDto) {
        const candidate  = await this.userService.getUserByEmail(userDto.email)
        if(candidate) {
            throw new HttpException('Пользователь с таким Email Уже зарегистрирован',HttpStatus.BAD_REQUEST)
        }
        const link = await uuid.v4()
        const hashPassword = await bcrypt.hash(userDto.password,5)
        const user = await this.userService.createUser({...userDto,password:hashPassword,activationLink:link})
        try {
            const mailService = await this.mailService.sendActivationMail(userDto,link)
        } catch (e){
            console.log('ERROR');
            console.log(e);

        }
        const tokens  =  await this.tokenService.generateToken(user)
        await  this.tokenService.saveToken(user.id,tokens.refreshToken)
        return {
            ...tokens,user:user
        }
    }
    async activate(link:string) {
        return await this.userService.activateUser(link)
    }
    private async validateUser(userDto:LoginUserDto):Promise<User> {
        const userWithMail =userDto.email? await this.userService.getUserByEmail(userDto.email) : undefined
        const userWithPhone =userDto.phone? await this.userService.getUserByPhone(userDto.phone):undefined
        const user = userWithMail || userWithPhone
        if(!user) {
            throw new HttpException(`К сожалению мы не нашли Вашу почту или телефон`,HttpStatus.BAD_REQUEST)
        }

        const passwordEquals = await bcrypt.compare(userDto.password,user.password)
        if (user && passwordEquals) {
            return user
        }
        throw new HttpException(`Неверный пароль`,HttpStatus.BAD_REQUEST)
    }
    async logout(refreshToken) {
        return await this.tokenService.removeToken (refreshToken);

    }
    async refresh(refreshToken){
        const userData = await this.tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await this.tokenService.findToken(refreshToken);
        if (!userData || !tokenFromDb) {
            throw new HttpException('неверный токен',HttpStatus.BAD_REQUEST)
        }
        const user = await this.userService.findById(userData.id)
        if (!user) {
            throw new HttpException(`К сожалению мы Вас не нашли, попробуйте залогиниться снова`,HttpStatus.BAD_REQUEST)
        }
        const tokens = await this.tokenService.generateToken(user);
        await this.tokenService.saveToken(user.id,tokens.refreshToken);
        return {...tokens, user: user}

    }

}
