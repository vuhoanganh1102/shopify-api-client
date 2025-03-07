import { Init } from './init.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
// import { Post } from './post.entity';
import { CommonStatus, MediaType } from '../../../helper/src/enum/index';

import { Products } from './products.entity';

@Entity('product_media')
export class ProductMedia extends Init {
  @Column({ name: 'url', type: 'varchar', length: 500 })
  url: string;

  @Column({ name: 'product_id', type: 'bigint', unsigned: true })
  productId: number;

  @Column({ name: 'type', type: 'int', default: MediaType.IMAGE })
  type: number;

  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Products;

  @Column({ name: 'status', type: 'tinyint', default: CommonStatus.ACTIVE })
  status: number;
}
