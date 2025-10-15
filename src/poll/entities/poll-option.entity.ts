import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Poll } from './poll.entity';
import { PollVote } from './poll-vote.entity';

export enum PollOptionStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

@Entity({ name: 'poll_options' })
export class PollOption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  poll_id: string;

  @ManyToOne(() => Poll, (poll) => poll.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poll_id' })
  poll: Poll;

  @Column()
  option_text: string;

  @Column({ type: 'int', default: 0 })
  vote_count: number;

  @Column({
    type: 'enum',
    enum: PollOptionStatus,
    default: PollOptionStatus.ENABLED,
  })
  status: PollOptionStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => PollVote, (vote) => vote.option)
  votes: PollVote[];
}
