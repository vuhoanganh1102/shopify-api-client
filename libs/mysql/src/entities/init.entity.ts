import {
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ synchronize: false })
export class Init {
  @PrimaryColumn({ name: 'id', type: 'bigint', unsigned: true })
  id?: number;

  @UpdateDateColumn({ name: 'update_at', type: 'datetime', select: false })
  updatedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', select: false })
  createdAt?: Date;
}
