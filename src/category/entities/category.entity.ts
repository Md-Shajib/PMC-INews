import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum CategoryStatus {
    ACTIVE = 'active',
    DISABLED = 'disabled'
}

@Entity({name: 'category'})
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ unique: true })
    name: string

    @Column({ nullable: true })
    image_url?: string

    @Column( { type: 'enum', enum: CategoryStatus, default: CategoryStatus.ACTIVE })
    status: CategoryStatus;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updated_at: Date;
}
