
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { NewsStatus, NewsType } from "../dto/create-news-post.dto";
import { Category } from "src/category/entities/category.entity";
import { Journalist } from "src/journalist/entities/journalist.entity";
import { Review } from "src/review/entities/review.entity";
import { Comment } from "src/comment/entities/comment.entity";
import { ViewLog } from "./view-logs.entity";

@Entity({ name: 'news_post' })
export class NewsPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  category_id: string;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column('uuid')
  journalist_id: string;

  @ManyToOne(() => Journalist, (journalist) => journalist.news_posts)
  @JoinColumn({ name: 'journalist_id' })
  journalist: Journalist;

  @Column({ type: 'enum', enum: NewsType })
  news_type: NewsType;

  @Column()
  news_title: string;

  @Column({ type: 'text' })
  news_body: string;

  @Column({ nullable: true })
  media_link: string;

  @Column({ type: 'int', default: 0 })
  views: number;

  @Column({ type: 'enum', enum: NewsStatus, default: NewsStatus.DRAFT })
  status: NewsStatus;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updated_at: Date;

  @OneToMany(() => Comment, (comment) => comment.news_post)
  comments: Comment[];

  @OneToMany(() => Review, (review) => review.news_post)
  reviews: Review[];

  @OneToMany(() => ViewLog, (viewLog) => viewLog.news)
  view_logs: ViewLog[];
}
