import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(phone);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = {
      phone: user.phone,
      sub: user.id,
      role: user.role,
      segmentId: user.segmentId,
    };
    return {
      access_token: this.jwtService.sign(payload),

      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
        role: user.role,
        segmentId: user.segmentId,
      },
    };
  }
}
