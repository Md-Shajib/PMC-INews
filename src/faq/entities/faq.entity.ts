import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum FaqStatus {
    ACTIVE = 'active',
    DISABLED = 'disabled'
}

@Entity({name: 'faq'})
export class Faq {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    title: string

    @Column('text')
    description: string;

    @Column( { type: 'enum', enum: FaqStatus, default: FaqStatus.ACTIVE })
    status: FaqStatus;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
