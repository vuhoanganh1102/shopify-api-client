import { Init } from './init.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { Products } from './products.entity';

@Entity('categories')
export class Categories extends Init {
  @Column({ name: 'category', type: 'int', nullable: true })
  category: number;

  @Column({ name: 'product_id', type: 'bigint', unsigned: true })
  productId: number;

  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Products;
}
