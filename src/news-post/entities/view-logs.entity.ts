import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Unique,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { NewsPost } from './news-post.entity';

@Entity({ name: 'view_logs' })
@Unique(['news_id', 'user_id'])
export class ViewLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  news_id: string;

  @ManyToOne(() => NewsPost, (newsPost) => newsPost.view_logs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'news_id' })
  news: NewsPost;

  @Column('uuid', { nullable: true })
  user_id: string | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  viewed_at: Date;
}
