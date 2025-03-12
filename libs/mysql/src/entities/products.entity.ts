import { Column, Entity, Index, OneToMany } from 'typeorm';
import { Init } from './init.entity';
import { ProductMedia } from './productMedia.entity';
import { Variants } from './variants.entity';
import { SyncFacebookType } from '../../../helper/src/enum';

@Entity('products')
export class Products extends Init {
  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'category', type: 'varchar', length: 255, nullable: true })
  category: string;

  @Column({ name: 'vendor', type: 'varchar', length: 255, nullable: true })
  vendor: string;

  @Column({
    name: 'pricing',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  pricing: number;

  @Column({ name: 'inventory', type: 'int', default: 0 })
  inventory: number;

  @Column({ name: 'quantity', type: 'int', default: 1 })
  quantity: number;

  @Column({ name: 'shipping', type: 'json', nullable: true })
  shipping: any;

  @Column({ name: 'variants', type: 'json', nullable: true })
  variants: any;

  @Column({ name: 'purchase_options', type: 'json', nullable: true })
  purchaseOptions: any;

  @Column({ name: 'metafields', type: 'json', nullable: true })
  metafields: any;

  @Column({ name: 'search_engine_listing', type: 'json', nullable: true })
  searchEngineListing: any;

  @Column({
    name: 'product_status',
    type: 'varchar',
    length: 50,
    default: 'draft',
  })
  productStatus: string;

  @Column({ name: 'publishing', type: 'json', nullable: true })
  publishing: any;

  @Column({ name: 'insights', type: 'json', nullable: true })
  insights: any;

  @Column({ name: 'product_organization', type: 'json', nullable: true })
  productOrganization: any;

  @Column({
    name: 'theme_template',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  themeTemplate: string;

  @Index()
  @Column({
    name: 'user_id',
    type: 'integer',
    unique: true,
    nullable: true,
  })
  userId: number;

  @Column({
    name: 'sync_facebook',
    type: 'integer',
    nullable: true,
    default: SyncFacebookType.SYNC,
  })
  syncFacebook: number;

  @OneToMany(() => ProductMedia, (pimg) => pimg.product)
  PostImage: ProductMedia[];

  @OneToMany(() => Variants, (vari) => vari.product)
  Variant: Variants[];
}
