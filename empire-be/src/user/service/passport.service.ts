import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository /*EntityRepository,*/ } from 'typeorm';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { User } from '../entity/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: 'http://localhost:4000/auth/google/callback',
      passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, displayName, name, emails, photos } = profile;
      const email = emails && emails[0]?.value;

      const existingUser = await this.userRepository.findOne({
        where: { googleid: profile.id },
      });

      if (existingUser) {
        if (existingUser.googleid === id) {
          return done(null, existingUser);
        } else if (existingUser.email === email) {
          return done(
            null,
            'The email already exists, login with your password',
          );
        }
      }

      const newUser = new User();
      newUser.id = uuidv4();
      newUser.googleid = id;
      newUser.firstname = displayName;
      newUser.lastname = name?.familyName || '';
      newUser.email = email || '';
      newUser.phonenumber = '';
      newUser.active = emails?.[0]?.verified === 'true';
      newUser.password = '';
      newUser.verificationtoken = '';
      newUser.resetpasswordtoken = '';
      newUser.otp = '';
      newUser.photo = photos?.[0]?.value || '';

      const createdUser = await this.userRepository.create(newUser);
      return done(null, createdUser);
    } catch (error) {
      console.error('Error in Google strategy:', error);
      throw new Error(`${error}`);
    }
  }
}
