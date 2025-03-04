import { Column, Entity } from 'typeorm';
import { Init } from './init.entity';

@Entity('facebook_member_token')
export class FacebookMemberToken extends Init {
  @Column({
    name: 'user_id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  userId: string;

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
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string;
}
