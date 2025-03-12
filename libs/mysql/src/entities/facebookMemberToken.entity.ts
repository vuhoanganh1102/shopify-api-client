import { Column, Entity, Index } from 'typeorm';
import { Init } from './init.entity';

@Entity('facebook_member_token')
export class FacebookMemberToken extends Init {
  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  name: string;

  @Column({
    name: 'token',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  token: string;

  @Column({
    name: 'expires_in',
    type: 'integer',
    nullable: true,
  })
  expiresIn: number;

  @Column({
    name: 'token_type',
    type: 'varchar',
    nullable: true,
  })
  tokenType: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string;

  @Index()
  @Column({
    name: 'shopify_user_id',
    type: 'integer',
    unsigned: true,
    unique: true,
  })
  shopifyUserId: number;
}
