import {
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository /*EntityRepository,*/ /*UpdateResult*/ } from 'typeorm';
import { User } from '../entity/user.entity';
import { Profile } from '../entity/profile.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { isAfter } from 'date-fns';
import { SignUpDto } from '../dto/user.dto';
import { ProfileDto, EditProfileDto } from '../dto/profile.dto';
import { MailerService } from './mailer.service';
import { generateOTP, generateVerificationToken } from './util.service';
import { OtpExpiredException } from '../type/user.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private mailerService: MailerService,
  ) {}

  async signUp(signUpDto: SignUpDto, profileDto: ProfileDto) {
    try {
      const id = uuidv4();
      const existingUser = await this.userRepository.findOne({
        where: {
          email: signUpDto.email,
        },
      });
      if (existingUser) {
        throw new ConflictException('Email already exist');
      }
      const passwordHashed = await bcrypt.hash(
        signUpDto.password,
        await bcrypt.genSalt(),
      );
      const { otp, expiry } = generateOTP();
      const verificationtoken = generateVerificationToken(id);
      const newUser = this.userRepository.create({
        ...signUpDto,
        id,
        password: passwordHashed,
        verificationtoken,
        otp,
        otpExpiry: expiry,
      });
      await this.userRepository.save(newUser);

      const newProfile = this.profileRepository.create({
        ...profileDto,
        user: newUser,
      });
      const userProfile = await this.profileRepository.save(newProfile);

      await this.mailerService.sendVerificationEmail(signUpDto.email, otp);
      return {
        message:
          'Registration successful. Check your email to activate your account.',
        user: newUser,
        userProfile,
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw new BadRequestException('Error registering user');
    }
  }

  async verifyEmail(code: string): Promise<{ message: string }> {
    try {
      console.log('Verifying email with OTP:', code);

      const user = await this.userRepository.findOne({
        where: {
          otp: code,
        },
      });

      console.log('User found:', user);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      console.log('User OTP expiry:', user.otpExpiry);

      if (isAfter(new Date(), user.otpExpiry)) {
        throw new OtpExpiredException();
      }

      //console.log('User email verification status:', user.isEmailVerified);

      if (user.isEmailVerified) {
        throw new UnauthorizedException('User already verified');
      }

      user.isEmailVerified = true;
      user.otp = null;
      user.otpExpiry = null;

      //console.log('Saving user:', user);
      await this.userRepository.save(user);
      //console.log('User saved successfully');

      return { message: 'Email verified successfully' };
    } catch (error) {
      //console.error('Error during email verification:', error);

      if (error instanceof NotFoundException) {
        return { message: error.message };
      }
      if (error instanceof OtpExpiredException) {
        return { message: error.message };
      }
      if (error instanceof UnauthorizedException) {
        return { message: error.message };
      }

      throw new InternalServerErrorException('Failed to verify user');
    }
  }

  async resendOtp(email: string): Promise<{ message: string }> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException('Email not found');
      }

      if (user.active) {
        throw new BadRequestException('User already verified');
      }

      const { otp, expiry } = generateOTP();
      const verificationtoken = generateVerificationToken(user.id);
      await this.userRepository.update(
        { email },
        { otpExpiry: expiry, otp, verificationtoken },
      );
      await this.mailerService.sendVerificationEmail(email, otp);

      return { message: 'A new OTP has been sent to your mail' };
    } catch (error) {
      throw new InternalServerErrorException('Failed to resend OTP');
    }
  }

  async editProfileName(profileId: string, editProfileDto: EditProfileDto) {
    try {
      const profile = await this.profileRepository.findOne({
        where: { id: profileId },
      });

      if (!profile) {
        throw new NotFoundException('User profile not found');
      }

      profile.username = editProfileDto.username;

      const updatedProfileName = await this.profileRepository.save(profile);

      return updatedProfileName;
    } catch (error) {
      console.error('Fail to edit profile', error);
      throw error;
    }
  }

  async removeProfilePhoto(profileId: string): Promise<Profile> {
    try {
      const profile = await this.profileRepository.findOne({
        where: { id: profileId },
      });
      if (!profile) {
        throw new NotFoundException('Profile not found');
      }
      // I update the photo property to null or an empty string
      profile.photo = null; // or profile.photo = '';
      // I save the updated profile
      const updatedProfile = await this.profileRepository.save(profile);
      return updatedProfile;
    } catch (error) {
      console.error('Error deleting profile photo:', error);
      throw new InternalServerErrorException('Failed to delete profile photo');
    }
  }

  async updateProfilePhoto(
    profileId: string,
    editProfileDto: EditProfileDto,
  ): Promise<Profile> {
    try {
      const profile = await this.profileRepository.findOne({
        where: { id: profileId },
      });

      if (!profile) {
        throw new NotFoundException('Profile not found');
      }

      if (editProfileDto.photo) {
        profile.photo = editProfileDto.photo;
      }

      const updatedProfile = await this.profileRepository.save(profile);
      return updatedProfile;
    } catch (error) {
      console.error('Error updating profile photo:', error);
      throw new InternalServerErrorException('Failed to update profile photo');
    }
  }

  async deleteUser(userId: string): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User does not exist');
      }
      await this.userRepository.remove(user);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw new InternalServerErrorException('Failed to delete user');
    }
  }

  // async deleteUser(id: string): Promise<User | null> {
  //   try {
  //     const user = await this.userRepository.findOne({ where: { id } });

  //     if (!user) {
  //       return null;
  //     }

  //     await this.userRepository.remove(user);
  //     return user;
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //     throw new InternalServerErrorException('Failed to delete user');
  //   }
  // }

  async getUserTheme(userId: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user.theme;
    } catch (error) {
      console.error('Error retrieving user theme from the database:', error);
      throw error;
    }
  }

  async updateUserTheme(userId: string, theme: string) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.theme = theme;
      await this.userRepository.save(user);
      return user.theme;
    } catch (error) {
      console.error('Error updating user theme from the database:', error);
      throw error;
    }
  }

  async getUserProfile(profileId: string) {
    try {
      const profile = await this.profileRepository.findOne({
        where: { id: profileId },
        relations: { user: true },
      });
      if (!profile) {
        throw new NotFoundException('User profile not found');
      }

      const user = profile.user;

      if (!user) {
        throw new NotFoundException('Unit not found');
      }

      return { profile, user };
    } catch (error) {
      console.error('Fail to get user profile', error);
      throw error;
    }
  }

  async getAllProfiles(): Promise<Profile[]> {
    try {
      const profiles = await this.profileRepository.find();
      return profiles;
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new NotFoundException(`User with this email ${email} not found`);
      }

      return user || null;
    } catch (error) {
      console.error('Error retrieving user from the database:', error);
      throw error;
    }
  }
}
