import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PollOption } from "./poll-option.entity";

export enum PollStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
}

@Entity({ name: 'poll' })
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'enum', enum: PollStatus, default: PollStatus.ACTIVE })
  status: PollStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => PollOption, (option) => option.poll, { cascade: true })
  options: PollOption[];
}
