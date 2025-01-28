import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/config/prisma.service";
// import { RegisterDto } from "src/modules/auth/dto/register.dto";
// import * as bcrypt from 'bcrypt';
import { Prisma } from "@prisma/client";


@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findByEmail(email: string) {
        return await this.prisma.user.findUnique({ where: { email } });
    }

    async createUserWithWallet(data: Prisma.UserCreateInput) {
        return await this.prisma.user.create({
            data: {
                ...data,
                Wallet: {
                    create: {
                        usable_balance: 0,
                        escrow_balance: 0,
                    },
                },
            },
        });
    }

    async generateVerificationCode(userId: string) {
        const code = Math.floor(100000 + Math.random() * 900000);
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                verificationCode: String(code),
                verificationCodeExpiry: expiry,
            },
        });

        return code;
    }
}