import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma.service';
import { CreateEscrowDto } from '../dto/create-escrow.dto';
import { Prisma, TransactionType } from '@prisma/client';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';

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
                // create transaction for buyer
                await prisma.transaction.create({
                    data: {
                        userId,
                        escrowId: escrow.id,
                        type: TransactionType.ESCROW_FUND,
                        amount: totalAmount,
                    },
                });
            }

            return escrow;
        });

        return escrow.id;
    }

    async getEscrowHistory(userId, { limit, page }: PaginationQueryDto) {
        const whereClause: Prisma.EscrowWhereInput = {
            OR: [
                { initiatorId: userId },
                { counterpartyId: userId }
            ]
        };
        const escrows = await this.prisma.escrow.findMany({
            where: whereClause,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                products: true,
                initiator: {
                    omit: { password_hash: true }
                },
                counterparty: {
                    omit: { password_hash: true }
                }
            }
        });

        const totalEscrows = await this.prisma.escrow.count({where: whereClause});

        return {
            items: escrows,
            currentPage: page,
            totalPages: Math.ceil(totalEscrows / limit),
            totalItems: totalEscrows,
        }
    }

}
