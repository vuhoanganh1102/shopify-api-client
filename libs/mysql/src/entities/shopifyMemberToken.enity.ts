import { Column, Entity } from 'typeorm';
import { Init } from './init.entity';

@Entity('shopify_member_token')
export class ShopifyMemberToken extends Init {
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
}
