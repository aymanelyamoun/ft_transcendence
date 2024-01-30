import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const {PORT} = process.env;
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors({
    credentials: true,
    origin: [process.env.FRONT_URL],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  
  // app.useGlobalPipes(new ValidationPipe({
  //   forbidNonWhitelisted: true,
  // }))
  app.useGlobalPipes(new ValidationPipe);
  try{
    // console.log("running on port : ", PORT);
    // await app.listen(process.env.PORT || 3000, '0.0.0.0');
    await app.listen(PORT, ()=>{`connected on port ${PORT}`});
  }
  catch (err){
    console.log(err);
  }
}
bootstrap();
