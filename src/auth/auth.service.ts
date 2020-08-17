import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { pick } from 'lodash';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dtos/register-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email, password) {
    const user = await this.usersService.findOne({
      email,
    });

    if (user && user.verifyPassword(password)) {
      return pick(user, ['avatar', 'email', 'fullname']);
    }

    return null;
  }

  async login(user: any) {
    const payload = pick(user, ['avatar', 'fullname', 'avatar']);
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(info: RegisterUserDto) {
    const user = await this.usersService.register(info);
    return this.login(user);
  }
}
