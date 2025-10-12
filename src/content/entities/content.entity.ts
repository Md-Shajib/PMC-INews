import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({name: 'content'})
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  header_logo_url: string;

  @Column()
  footer_logo_url: string;

  @Column()
  app_qr_url: string;

  @Column({ type: 'text' })
  footer_text: string;

  @Column({ type: 'text' })
  our_mission: string;

  @Column({ type: 'text' })
  history: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
