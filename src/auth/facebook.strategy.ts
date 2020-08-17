import * as FacebookTokenStrategy from 'passport-facebook-token';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { use } from 'passport';

@Injectable()
export class FacebookStratery {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    this.init();
  }
  init() {
    use(
      new FacebookTokenStrategy(
        {
          clientID: this.configService.get('FACEBOOK_APP_ID'),
          clientSecret: this.configService.get('FACEBOOK_APP_SECRET'),
          fbGraphVersion: 'v7.0',
          scopeSeparator: 'name,email,picture.width(720).height(720)',
        },
        async (
          accessToken: string,
          refreshToken: string,
          profile,
          done: any,
        ) => {
          const user = await this.usersService.handleFacebookUser(profile);
          return done(null, user);
        },
      ),
    );
  }
}
