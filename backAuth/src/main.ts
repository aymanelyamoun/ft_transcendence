import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as cookieParser from 'cookie-parser';

import * as passport from 'passport';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.enableCors({
     credentials: true,
  origin: 'http://localhost:3000', 
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
  



  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    //will automatically remove any properties from the DTO that do not have corresponding validation rules
    forbidNonWhitelisted: true,
    //validationPipe will throw an exception if any extra properties (properties not defined in your DTO class) are present in the incoming data.
    transform: true,
  }))
  
  // app.use(
  //   session({
  //     secret : 'kljdlkjsdkljsg',
  //     saveUninitialized:false,
  //     resave:false,
  //     cookie: {
  //       maxAge: 60000, 
  //     },
  //   }),
  // )
  // app.use(passport.initialize());
  // app.use(passport.session());
  await app.listen(8000);
}

// async function bootstrap() {
//   app.setGlobalPrefix('api');
//   const app = await NestFactory.create(AppModule, { express: express() });
//   await app.listen(3000);
// }
bootstrap();
