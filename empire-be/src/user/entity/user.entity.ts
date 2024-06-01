import {
  Column,
  Entity,
  OneToOne,
  JoinColumn,
  //PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ nullable: true })
  username?: string;

  @Column()
  phonenumber: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  active: boolean;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column('json', { nullable: true })
  photo?: string[];

  @Column({ default: 'light' })
  theme: string;

  @Column({ nullable: true })
  resetpasswordcode: string | null;

  @Column({ default: false })
  resetpasswordstatus: boolean;

  @Column({ nullable: true })
  resetpasswordexpiration: number | null;

  @Column({ nullable: true })
  resetpasswordcode: string | null;

  @Column({ default: false })
  resetpasswordstatus: boolean;

  @Column({ nullable: true })
  resetpasswordexpiration: number | null;

  @Column({ nullable: false })
  otp: string;

  @Column({ type: 'timestamp' })
  otpExpiry: Date;

  @Column({ default: '' })
  googleid: string;

  @Column({ default: '' })
  resetpasswordtoken: string;

  @Column({ nullable: true })
  verificationtoken: string | null;

  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn()
  profile: Profile;
}
