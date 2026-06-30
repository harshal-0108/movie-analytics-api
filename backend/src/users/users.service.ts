import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async getProfile(email: string) {
    return this.userModel.findOne({ email });
  }

  async updateProfile(email: string, data: { name?: string; email?: string; password?: string }) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return null;
    }

    if (data.name) {
      user.name = data.name;
    }

    if (data.email) {
      user.email = data.email;
    }

    if (data.password) {
      user.password = data.password;
    }

    return user.save();
  }

  async updatePreferences(emailOrPreferences: string | Record<string, any>, preferences?: Record<string, any>) {
    const email = typeof emailOrPreferences === 'string' ? emailOrPreferences : 'harshal@example.com';
    const payload = typeof emailOrPreferences === 'string' ? preferences : emailOrPreferences;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      return null;
    }

    user['preferences'] = {
      ...(user as any).preferences,
      ...payload,
    };

    await user.save();
    return user;
  }
}
