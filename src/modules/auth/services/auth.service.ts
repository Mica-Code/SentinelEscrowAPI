import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/modules/users/services/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from '../dto/register.dto';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/config/prisma.service';
// import { User } from 'src/modules/users/schemas/users.schema';


@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private prisma: PrismaService
    ) { }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new NotFoundException('User with this email not found');

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) throw new UnauthorizedException('Invalid credentials');
        
        return user;
    }

    // async validateGoogleUser(email: string, firstName: string, lastName: string) {
    //     let user = await this.usersService.findByEmail(email);
    //     if (!user) {
    //         user = await this.usersService.create({
    //             email,
    //             firstName,
    //             lastName,
    //             password: null, // No password for Google users
    //         });
    //     }
    //     return user;
    // }

    async validateJwtPayload(payload: JwtPayload) {
        const user = await this.usersService.findByEmail(payload.email);
        if (!user) {
            return null;
        }
        return user;
    }

    async login(user: User) {
        const payload: JwtPayload = { sub: user.id, email: user.email };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    // async adminLogin(user: User) {
    //     if (user.role !== 'admin') throw new UnauthorizedException('Access denied');
    //     const payload: JwtPayload = { sub: user.id, email: user.email };
    //     return {
    //         accessToken: this.jwtService.sign(payload),
    //     };
    // }

    async register(registerDto: RegisterDto) {
        if (await this.usersService.findByEmail(registerDto.email)) {
            throw new BadRequestException('Email already exists');
        }
        const passwordHash = await bcrypt.hash(registerDto.password, 10);

        const user = await this.usersService.createUserWithWallet({
            date_of_birth: registerDto.dateOfBirth,
            email: registerDto.email,
            fullname: registerDto.fullname,
            gender: registerDto.gender,
            marketing_source: registerDto.marketingSource,
            password_hash: passwordHash,
            phone: registerDto.phone,
            referral_code: registerDto.referralCode,
        });
        const payload: JwtPayload = { sub: user.id, email: user.email };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    async refreshToken(user: User) {
        const payload: JwtPayload = { sub: user.id, email: user.email };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }

    async forgotPassword(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new NotFoundException('User with this email not found');
        const code = this.usersService.generateVerificationCode(user.id);

        return code;
    }

    async resetPassword(email: string, verificationCode: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new BadRequestException('User not found');
        if (user.verificationCode !== verificationCode) throw new BadRequestException('Verification code is not correct');
        if (user.verificationCodeExpiry < new Date()) throw new BadRequestException('Verification code has expired');

        const passwordHash = await bcrypt.hash(password, 10);

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password_hash: passwordHash,
            },
        });

        return 'Password reset successfully';
    }
}
