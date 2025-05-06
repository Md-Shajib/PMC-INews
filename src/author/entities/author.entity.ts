import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'author'})
export class Author {
    @PrimaryGeneratedColumn('uuid')
    author_id: string

    @Column()
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    bio: string
}
