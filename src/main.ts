import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser'
async function bootstrap() {
  const PORT = process.env.PORT || 4000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser())
  app.enableCors()

  const config = new DocumentBuilder()
    .setTitle('Сервер для парикмахерской')
    .setDescription('Pet project')
    .setVersion('1.0.0')
    .addTag('UglyNixon sandra hair')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  try{
    await app.listen(PORT, () => {
      console.log(`Server start on PORT = ${PORT}`);
    });
  }catch (e){
    console.log(e)
  }

}
bootstrap();
