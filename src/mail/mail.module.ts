import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import {MailerModule} from "@nestjs-modules/mailer";
import {HandlebarsAdapter} from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";

@Module({
    providers: [MailService],
    imports:[
        MailerModule.forRootAsync({
            useFactory : ()=>({ transport: {
                    host: process.env.MAIL_HOST,
                    port: +process.env.MAIL_PORT,
                    // secure: ture, // upgrade later with STARTTLS
                    auth: {
                        user: process.env.MAIL_USER,
                        pass:  process.env.MAIL_PASSWORD,
                    },
                },
                defaults: {
                    from:'"nest-modules" <modules@nestjs.com>',
                },
                template: {
                    dir: process.cwd() + '/templates/',
                    adapter: new HandlebarsAdapter(), // or new PugAdapter()
                    options: {
                        strict: true,
                    },
                },})

        }),
    ],
    exports:[MailService]
})
export class MailModule {

}