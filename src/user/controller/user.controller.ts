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
  async signUp(
    @Body(ValidationPipe) signUpDto: SignUpDto,
    profileDto: ProfileDto,
  ) {
    return this.userService.signUp(signUpDto, profileDto);
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

  @Delete('remove/:userId')
  async deleteUser(@Param('id') userId: string): Promise<void> {
    return this.userService.deleteUser(userId);
  }

  @Patch('edit-name/:id')
  async editProfileName(
    @Param('id') profileId: string,
    @Body() editProfileDto: EditProfileDto,
  ) {
    return await this.userService.editProfileName(profileId, editProfileDto);
  }

  @Delete('remove/:profileId')
  async removeProfilePhoto(@Param('profileId') profileId: string) {
    return this.userService.removeProfilePhoto(profileId);
  }

  @Patch('edit-photo/:profileId')
  async updateProfilePhoto(
    @Param('profileId') profileId: string,
    @Body() editProfileDto: EditProfileDto,
  ) {
    return this.userService.updateProfilePhoto(profileId, editProfileDto);
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

  @Get('single/:id')
  async getUserProfile(@Param('id') profileId: string) {
    return this.userService.getUserProfile(profileId);
  }

  @Get('/:email')
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    return this.userService.getUserByEmail(email);
  }

  @Get('/all')
  async getAllProfiles() {
    return this.userService.getAllProfiles();
  }
}
