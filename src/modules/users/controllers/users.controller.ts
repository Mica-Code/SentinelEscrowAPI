import { Controller, Get, Req } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UsersService } from "../services/users.service";
import { AuthRequest } from "src/modules/auth/interfaces/auth-request.interface";


@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('profile')
    async getUserProfile(@Req() req: AuthRequest) {
        return { ...req.user, password_hash: undefined };
    }
}