import { Controller, Post, Body, Req, UseGuards, Query } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '../guards/local-auth.guard';
import { JwtAuthGuard, Public } from '../guards/jwt-auth.guard';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthRequest } from '../interfaces/auth-request.interface';
import { ResetPasswordDto } from '../dto/reset-password.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('login')
    @UseGuards(LocalAuthGuard)
    async login(@Body() loginDto: LoginDto, @Req() req: AuthRequest) {
        return this.authService.login(req.user);
    }

    @Public()
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('refresh')
    @UseGuards(JwtAuthGuard)
    async refresh(@Req() req) {
        return this.authService.refreshToken(req.user);
    }

    @Public()
    @Post('forgot-password')
    async forgotPassword(@Query('email') email: string) {
        await this.authService.forgotPassword(email);
        return "Verification code has been sent to your email";
    }

    @Public()
    @Post('reset-password')
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        const { email, password, verificationCode } = resetPasswordDto;
        await this.authService.resetPassword(email, verificationCode, password);
        return "Password reset successfully";
    }
}
