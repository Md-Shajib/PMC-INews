import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { Poll } from "./poll.entity";
import { PollOption } from "./poll-option.entity";

@Entity({ name: 'poll_vote' })
@Unique(['poll_id', 'user_id'])
export class PollVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  poll_id: string;

  @ManyToOne(() => Poll, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'poll_id' })
  poll: Poll;

  @Column('uuid')
  option_id: string;

  @ManyToOne(() => PollOption, (option) => option.votes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'option_id' })
  option: PollOption;

  @Column('uuid')
  user_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
