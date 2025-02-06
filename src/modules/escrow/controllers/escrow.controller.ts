import { Body, Controller, Post, Req } from '@nestjs/common';
import { EscrowService } from '../services/escrow.service';
import { AuthRequest } from 'src/modules/auth/interfaces/auth-request.interface';
import { CreateEscrowDto } from '../dto/create-escrow.dto';

@Controller('escrow')
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) { }

  @Post('new')
  createEscrow(
    @Req() req: AuthRequest,
    @Body() createEscrowDto: CreateEscrowDto
  ) {
    return this.escrowService.create(req.user.id, createEscrowDto)
  }
}
