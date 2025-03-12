import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('shopify_member_token')
export class ShopifyMemberToken {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id?: number;

  @Column({
    name: 'shop',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  shop: string;

  @Column({
    name: 'state',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  state: string;

  @Column({
    name: 'is_online',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  isOnline: number;

  @Column({
    name: 'scope',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  scope: string;

  @Column({
    name: 'access_token',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  accessToken: string;

  @UpdateDateColumn({ name: 'update_at', type: 'datetime', select: false })
  updatedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', select: false })
  createdAt?: Date;
}
