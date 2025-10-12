import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MemberStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
}

export enum TeamRole {
  EDITOR = 'editor',
  PUBLISHER = 'publisher',
  MODERATOR = 'moderator'
}

@Entity({ name: 'team_member' })
export class TeamMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  image_url?: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'enum', enum: TeamRole, default: TeamRole.EDITOR })
  role: TeamRole;

  @Column({ type: 'enum', enum: MemberStatus, default: MemberStatus.ACTIVE })
  status: MemberStatus;

  @Column({ nullable: true })
  facebook_url?: string;

  @Column({ nullable: true })
  twitter_url?: string;

  @Column({ nullable: true })
  youTube_url?: string;

  @Column({ nullable: true })
  linkedin_url?: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}
