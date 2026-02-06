import { Module } from '@nestjs/common';
import { ReunioesController } from './reunioes.controller';
import { ReunioesService } from './reunioes.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ReunioesController],
  providers: [ReunioesService],
  exports: [ReunioesService],
})
export class ReunioesModule {}
