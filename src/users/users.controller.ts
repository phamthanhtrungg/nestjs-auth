import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/fake')
  factory(@Query('amount', ParseIntPipe) amount: number) {
    return this.usersService.factory(amount);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  me(@Req() req) {
    return req.user;
  }
}
