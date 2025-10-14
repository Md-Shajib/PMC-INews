import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NewsPost } from 'src/news-post/entities/news-post.entity';

export enum CommentType {
  COMMENT = 'comment',
  REPLAY = 'replay',
}

export enum CommentStatus {
  ACTIVE = 'active',
  DISABLED = 'disabled'
}

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  news_id: string;

  @ManyToOne(() => NewsPost, (newsPost) => newsPost.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'news_id' })
  news_post: NewsPost;

  @Column('uuid')
  user_id: string;

  @Column()
  comment: string;

  @Column({ type: 'uuid', nullable: true })
  parent_id: string | null;

  @ManyToOne(() => Comment, (parent) => parent.replies, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment;

  @OneToMany(() => Comment, (reply) => reply.parent, { cascade: true })
  replies: Comment[];
  
  @Column({
    type: 'enum',
    enum: CommentType,
    default: CommentType.COMMENT,
  })
  type: CommentType;

  @Column({type: 'enum', enum: CommentStatus, default: CommentStatus.ACTIVE})
  status: CommentStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;
}

