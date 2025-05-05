import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum CommentType {
    COMMENT = 'comment',
    REPLY = 'reply',
}

@Entity({name: 'comments'})
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('uuid')
    post_id: string

    @Column('uuid')
    user_id: string

    @Column()
    comment: string

    @Column({type: 'uuid', nullable:true, default: null})
    parent_id: string

    @Column({
        type: 'enum',
        enum: CommentType,
        default: CommentType.COMMENT,
    })
    type: CommentType;

    @Column({ type: 'timestamp' })
    date: Date
}
