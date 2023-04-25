import {Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/user-login.dto';
import { AuthService } from './auth.service';
import * as cookie from 'cookie';
import * as express from 'express';

@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService) {
    }

    @Post('/login')
    login(@Body() userDto:LoginUserDto){
        return this.authService.login(userDto)
    }
    // @UsePipes(ValidationPipe)
    @Post('/registration')
    async registration(
        @Body() userDto:CreateUserDto,
        @Res({ passthrough: true }) response: express.Response

    ){
        const userData =await this.authService.registration(userDto)
        response.cookie('refreshToken',userData.refreshToken,{maxAge:20*24*60*60*1000,httpOnly:true})
        return userData
    }

    @Get('/activate/:link')
    async activate(
        @Res() res:express.Response,
        @Param() params) {
        this.authService.activate(params.link)
        return res.redirect(`${process.env.CLIENT_API_URL}/activate/complete`);
        
    }
    @Get('/logout')
    async logout (
        @Res({ passthrough: true }) response:express.Response,
        @Req() request:express.Request
    ) {
        if (request.cookies?.refreshToken){
            const {refreshToken} =request.cookies;
            const token = await this.authService.logout(refreshToken);
            response.clearCookie('refreshToken');
            return {message:'Logout'}
        }

    }
    @Get('/refresh')
    async refresh (@Res({ passthrough: true }) response:express.Response,  @Req()  request:express.Request) {
        try {
            const {refreshToken} = request.cookies;
            const userData = await this.authService.refresh(refreshToken)
            response.cookie('refreshToken',userData.refreshToken,{maxAge:30*24*60*60*1000,httpOnly:true})
            return {message:'refresh'}
        }catch (e) {
            throw new HttpException('неверный токен',HttpStatus.BAD_REQUEST)
        }
    }



}
