import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  // OneToMany,
  // OneToOne,
  //PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';
import { Status } from '../enum/profile.enum';

@Entity({ name: 'profile' })
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ nullable: true })
  username?: string;

  @Column({ type: 'enum', enum: Status })
  status: string;

  @Column('json', { nullable: true })
  photo?: string[];

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user: User;
}
