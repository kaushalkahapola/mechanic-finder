import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const user = await this.userService.getProfile(req.user.sub);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @Request() req,
    @Body() updateProfileDto: UpdateUserProfileDto,
  ) {
    const user = await this.userService.updateProfile(req.user.sub, updateProfileDto);
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
