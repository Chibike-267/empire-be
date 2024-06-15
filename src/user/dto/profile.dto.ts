export class ProfileDto {
  firstname: string;
  lastname: string;
  username?: string;
  photo?: string[];
}

export class EditProfileDto {
  username?: string;
  photo?: string[];
}
