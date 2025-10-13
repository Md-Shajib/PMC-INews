import { NewsPost } from 'src/news-post/entities/news-post.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

export enum JournalistStatus {
  ACTIVE = 'active',
  BANNED = 'banned',
}

@Entity({ name: 'journalist' })
export class Journalist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  image_url?: string;

  @Column({
    type: 'enum',
    enum: JournalistStatus,
    default: JournalistStatus.ACTIVE,
  })
  status: JournalistStatus;

  @Column({ nullable: true })
  location?: string;

  @Column({ type: 'date', nullable: true })
  birthday?: Date;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @Column({ nullable: true })
  facebook?: string;

  @Column({ nullable: true })
  twitter?: string;

  @Column({ nullable: true })
  linkedin?: string;

  @OneToMany(() => NewsPost, (newsPost) => newsPost.journalist)
  news_posts: NewsPost[];
}
