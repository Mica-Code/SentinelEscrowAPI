import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateEscrowDto } from '../dto/create-escrow.dto';

@Injectable()
export class EscrowService {
    constructor(private prisma: PrismaService) { }

    async create(userId: string, createEscrowDto: CreateEscrowDto) {
        const { role, products, deliveryDate, notes } = createEscrowDto;
        const totalAmount = products.reduce((acc, product) => acc + product.unitPrice * product.quantity, 0);

        // check wallet balance if role is buyer
        if (role === 'BUYER') {
            const wallet = await this.prisma.wallet.findUnique({
                where: {
                    user_id: userId
                }
            });
            if (wallet.usable_balance < totalAmount) {
                throw new Error('Insufficient balance in wallet');
            }
        }

        const escrow = await this.prisma.$transaction(async (prisma) => {
            const escrow = await prisma.escrow.create({
                data: {
                    initiatorId: userId,
                    role,
                    totalAmount,
                    currency: 'NGN',
                    deliveryDate: deliveryDate,
                    notes,
                    status: 'PENDING',
                    isFunded: false,
                    products: {
                        create: products.map(product => ({
                            name: product.name,
                            unitPrice: product.unitPrice,
                            quantity: product.quantity,
                            totalCost: product.unitPrice * product.quantity
                        }))
                    }
                }
            });

            // debit usable balance and add to escrow balance
            if (role === 'BUYER') {
                await prisma.wallet.update({
                    where: {
                        user_id: userId
                    },
                    data: {
                        usable_balance: {
                            decrement: totalAmount
                        },
                        escrow_balance: {
                            increment: totalAmount
                        }
                    }
                });
            }

            return escrow;
        });

        return escrow.id;
    }

    
}
