import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';
import * as faker from 'faker';
import { RegisterUserDto } from '../auth/dtos/register-user.dto';
import { Op } from 'sequelize';
import * as FacebookTokenStrategy from 'passport-facebook-token';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    private mailService: MailService,
  ) {}

  factory(amount = 1) {
    const users = [];
    for (let i = 0; i < amount; ++i) {
      users.push({
        fullname: faker.name.findName(),
        email: faker.internet.email(),
        avatar: faker.image.cats(),
        password: faker.internet.password(),
      });
    }
    return this.userModel.bulkCreate(users);
  }

  findOne(condition) {
    return this.userModel.findOne({
      where: {
        ...condition,
      },
    });
  }

  async register(info: RegisterUserDto) {
    const user = await this.findOne({
      email: info.email ?? '',
    });
    if (user) {
      throw new BadRequestException('Email không hợp lệ');
    }
    await this.mailService.sendMail(
      info.email,
      'Chào mừng đến với Room manager',
      'welcome',
    );
    return this.userModel.create(info);
  }

  async handleFacebookUser(profile: FacebookTokenStrategy.Profile) {
    const userEmail = profile.emails[0].value;
    const user = await this.findOne({ email: userEmail });
    if (user) {
      await this.userModel.update(
        { facebookId: profile.id, emailValidate: new Date() },
        {
          where: {
            email: userEmail,
          },
        },
      );
      return user;
    } else {
      const userFullname = profile.displayName;
      const randomPwd = faker.internet.password();
      await this.mailService.sendMail(
        userEmail,
        'Chào mừng đến với Room Manager',
        'welcome_facebook',
        {
          'x:pwd': randomPwd,
        },
      );
      return this.userModel.create({
        email: userEmail,
        fullname: userFullname,
        facebookId: profile.id,
        avatar: profile.photos[0].value,
        password: randomPwd,
        emailValidate: new Date(),
      });
    }
  }
}
