import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({

  imports: [PrismaModule],
  providers: [PrismaService,],
  exports: [PrismaService,]
})
export class PrismaModule {}
