import { Module } from '@nestjs/common';
import { ZapsignService } from './zapsign.service';
import { ZapsignController } from './zapsign.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ZapsignController],
  providers: [ZapsignService],
  exports: [ZapsignService],
})
export class ZapsignModule {}
