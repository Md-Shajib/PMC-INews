import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { NewsStatus } from "../dto/create-news-post.dto";
import { IsDateString, IsInt } from "class-validator";


@Entity({name: 'news_post'})
export class NewsPost {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('uuid')
    category_id: string

    @Column()
    post_date: Date

    @Column()
    news_title: string

    @Column()
    news_content: string

    @Column({type: 'enum', enum: NewsStatus, default: NewsStatus.DRAFT})
    news_status: string

    @Column({ type: 'int', default: 0 })
    view_count: number

    @Column('uuid')
    author_id: string
}

