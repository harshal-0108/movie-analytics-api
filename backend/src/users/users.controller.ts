import { Body, Controller, Get, Put, Req } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Req() req: any) {
    const email = req?.user?.email || 'harshal@example.com';
    return this.usersService.getProfile(email);
  }

  @Put('me')
  async updateMe(@Req() req: any, @Body() body: { name?: string; email?: string; password?: string }) {
    const email = req?.user?.email || 'harshal@example.com';
    return this.usersService.updateProfile(email, body);
  }

  @Put('me/preferences')
  async updatePreferences(@Req() req: any, @Body() body: Record<string, any>) {
    const email = req?.user?.email || 'harshal@example.com';
    return this.usersService.updatePreferences(email, body);
  }
}
