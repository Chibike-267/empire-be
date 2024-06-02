export class ProfileDto {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  photo?: string[];
}

export class EditProfileDto {
  username: string;
  photo?: string[];
}
