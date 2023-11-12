import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const {PORT} = process.env;
  app.setGlobalPrefix('api');
  // app.useGlobalPipes(new ValidationPipe);
  try{
    await app.listen(PORT, ()=>{`connected on port ${PORT}`});
  }
  catch (err){
    console.log(err);
  }
}
bootstrap();
