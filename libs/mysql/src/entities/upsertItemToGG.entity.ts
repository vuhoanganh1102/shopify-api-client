import { ItemStatus } from '../../../helper/src/enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('upsert_items_to_google')
export class UpsertItemsToGoogle {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id?: number;

  @Column({ name: 'product_id', type: 'varchar', length: 255, nullable: true })
  productId: string;

  @Column({ name: 'variant_id', type: 'varchar', length: 255, nullable: true })
  variantId: string;

  @Column({ name: 'shop', type: 'varchar', length: 255, nullable: true })
  shop: string;

  @Column({ name: 'status', type: 'int', default: ItemStatus.ACTIVE })
  status: number;

  @Column({ name: 'chanel', type: 'int', nullable: true })
  chanel: number;

  @UpdateDateColumn({ name: 'update_at', type: 'datetime', select: false })
  updatedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', select: false })
  createdAt?: Date;
}
