import { Module } from '@nestjs/common';
import { EscrowService } from './services/escrow.service';
import { EscrowController } from './controllers/escrow.controller';
import { PrismaService } from 'src/config/prisma.service';

@Module({
  controllers: [EscrowController],
  providers: [PrismaService, EscrowService],
})
export class EscrowModule {}
