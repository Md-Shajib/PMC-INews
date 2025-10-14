import { IsNotEmpty } from "class-validator";
import { NewsPost } from "src/news-post/entities/news-post.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity({ name: 'review' })
@Unique(['news_id', 'user_id'])
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  @IsNotEmpty()
  news_id: string;

  @ManyToOne(() => NewsPost, (newsPost) => newsPost.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'news_id' })
  news_post: NewsPost;

  @Column('uuid')
  @IsNotEmpty()
  user_id: string;

  @Column({ type: 'decimal', precision: 3, scale: 1 }) // 4.5
  rating: number;

  @Column({ type: 'text', nullable: true })
  review?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
