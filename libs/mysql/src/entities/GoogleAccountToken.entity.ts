import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('google_account_token')
export class GoogleAccountToken {
  @PrimaryColumn({
    name: 'shop',
    type: 'varchar',
    unique: true,
  })
  shop: string;

  @Column({
    name: 'id',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  name: string;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  email: string;

  @Column({
    name: 'picture',
    type: 'longtext',
    nullable: true,
  })
  picture: string;
  @Column({
    name: 'refresh_token',
    type: 'longtext',
    nullable: true,
  })
  refreshToken: string;

  @Column({
    name: 'access_token',
    type: 'longtext',
    nullable: true,
  })
  accessToken: string;

  @Column({
    name: 'expire_in',
    type: 'bigint',
    nullable: true,
  })
  expireIn: string;

  @UpdateDateColumn({ name: 'update_at', type: 'datetime', select: false })
  updatedAt?: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime', select: false })
  createdAt?: Date;
}
