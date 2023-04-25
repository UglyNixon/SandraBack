import {Injectable} from "@nestjs/common";
import {InjectModel} from "@nestjs/sequelize";
import {CreateUserDto} from "../users/dto/create-user.dto";
import { User } from "src/users/users.model";
import { Token } from "./token.model";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class TokenService{
    constructor(
        @InjectModel(Token) private tokenRepository: typeof Token,
        private jwtService:JwtService

    ) {}



    async generateToken (user:User) {
        const payload =  {id:user.id,mail:user.email,roles:user.roles,name:user.name}
        const  refreshToken =this.jwtService.sign(payload)
        const accessToken =this.jwtService.sign(payload,{secret:process.env.PRIVATE_ACCESS_KEY,expiresIn:'90m'})
        return {
            refreshToken,
            accessToken
        }

    }
    async saveToken (userId:number,refreshToken:string) {
        const tokenData = await this.tokenRepository.findOne({where:{userId}})
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save()
        }
        const token = await this.tokenRepository.create({userId:userId,refreshToken})
        return token;
    }
    async removeToken (refreshToken) {
        const token= await this.tokenRepository.destroy({where:{refreshToken:refreshToken}})
        return token;
    }

    async validateRefreshToken (refreshToken) {
        const userData =  await this.jwtService.verify(refreshToken);
        return userData
    }

    async findToken(token){
        const tokenData = await this.tokenRepository.findOne({where:{refreshToken:token}})
        return tokenData;
    }



}