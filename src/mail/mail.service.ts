import { Injectable } from '@nestjs/common';
import {MailerService} from "@nestjs-modules/mailer";

@Injectable()
export class MailService {
    constructor(readonly mailerService:MailerService) {
    }
    async sendActivationMail(dto,link){
        await this.mailerService.sendMail({
            to: dto.email,
            from: 'aleksandrs@brokans.org',
            subject: 'Завершение регистрации',
            template: 'index',
            context: {
                //Поменять адрес пересылки
                link:`${process.env.API_URL}/api/auth/activate/${link}`,
                name:dto.name,
                firstName:dto.firstName,
                mail:dto.email,
                password:dto.password
            },
        })
    }
}