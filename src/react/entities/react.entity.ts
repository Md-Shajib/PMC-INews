import { IsNotEmpty, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


export enum ReactionType {
    LIKE = 'like',
    LOVE = 'love',
    HAHA = 'haha',
    SAD = 'sad',
    ANGRY = 'angry',
}


@Entity({ name: 'react' })
export class React {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    user_id: string;

    @Column('uuid')
    post_id: string;

    @Column({ type: 'enum', enum: ReactionType })
    type: ReactionType;

    @Column({ type: 'timestamp' })
    publishDate: Date;
}