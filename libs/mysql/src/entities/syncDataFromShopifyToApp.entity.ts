import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sync_data_from_shopify_to_app')
export class SyncDataFromShopifyToApp {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'cursor', type: 'varchar', length: 500 })
  cursor: string;

  @Index()
  @Column({
    name: 'shop',
    type: 'varchar',
    length: 500,
  })
  shop: string;

  @UpdateDateColumn({ name: 'update_at', type: 'datetime', select: false })
  updatedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', select: false })
  createdAt?: Date;
}
