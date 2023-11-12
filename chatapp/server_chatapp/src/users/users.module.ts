import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Services } from 'src/utils/constants';

@Module({
  controllers: [UsersController],
  providers: [{
    provide: Services.USERS,
    useClass: UsersService,
  }],
  exports: [{
    provide: Services.USERS,
    useClass: UsersService,
  }],
})
export class UsersModule {}
