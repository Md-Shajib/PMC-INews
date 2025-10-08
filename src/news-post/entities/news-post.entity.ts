
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { NewsStatus, NewsType } from "../dto/create-news-post.dto";

@Entity({ name: 'news_post' })
export class NewsPost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  category_id: string;

  @Column('uuid')
  journalist_id: string;

  @Column({ type: 'enum', enum: NewsType})
  news_type: string;

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
}
