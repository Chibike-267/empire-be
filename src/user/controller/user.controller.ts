import {
  Controller,
  Post,
  Body,
  Param,
  ValidationPipe,
  Delete,
  Get,
  Patch,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { ResendOtpDto, SignUpDto, UpdateUserThemeDto } from '../dto/user.dto';
import { ProfileDto, EditProfileDto } from '../dto/profile.dto';
import { User } from '../entity/user.entity';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  async signUp(@Body(ValidationPipe) signUpDto: SignUpDto): Promise<User> {
    return this.userService.signUp(signUpDto);
  }

  @Post('resend')
  async resendOtp(@Body() @Body() resendOtpDto: ResendOtpDto) {
    return this.userService.resendOtp(resendOtpDto.email);
    // try {
    //   const { email } = resendOtpDto;
    //   const { message } = await this.userService.resendOtp(email);
    //   return { message };
    // } catch (error) {
    //   throw error;
    // }
  }

  @Post('verify')
  async verifyEmail(@Body('code') code: string) {
    return this.userService.verifyEmail(code);
  }

  @Get('/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @Delete('delete/:userId')
  async deleteUser(@Param('id') userId: string): Promise<void> {
    return this.userService.deleteUser(userId);
  }

  @Post('profile/:userId')
  async UserProfile(
    @Param('userId') userId: string,
    @Body() profileDto: ProfileDto,
  ) {
    return await this.userService.profile(userId, profileDto);
  }

  @Patch('edit-profile/:profileId')
  async editProfile(
    @Param('id') profileId: string,
    @Body() editProfileDto: EditProfileDto,
  ) {
    return await this.userService.editProfile(profileId, editProfileDto);
  }

  @Get('single/:profileId')
  async getUserProfile(@Param('id') profileId: string) {
    return this.userService.getUserProfile(profileId);
  }

  @Delete('cancel/:profileId')
  async cancelProfile(@Param('id') profileId: string) {
    return this.userService.cancelProfile(profileId);
  }

  @Get('/all')
  async getAllProfiles() {
    return this.userService.getAllProfiles();
  }

  @Delete('remove/:profileId')
  async deleteProfile(@Param('id') profileId: string) {
    return this.userService.deleteProfile(profileId);
  }

  @Get('theme/:userId')
  async getUserTheme(@Param('id') userId: string) {
    return this.userService.getUserTheme(userId);
  }

  @Patch('update-theme/:userId')
  async updateUserTheme(
    @Param('id') userId: string,
    @Body() updateUserThemeDto: UpdateUserThemeDto,
  ) {
    return this.userService.updateUserTheme(userId, updateUserThemeDto.theme);
  }
}
