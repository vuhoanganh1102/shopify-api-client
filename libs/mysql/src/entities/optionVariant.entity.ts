import { Init } from './init.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Products } from './products.entity';

@Entity('option_variant')
export class OptionVariant extends Init {
  @Column({ name: 'title', type: 'varchar', nullable: true, length: 255 })
  title: string;

  @Column({ name: 'value', type: 'varchar', nullable: true, length: 255 })
  value: string;

  @Column({ name: 'product_id', type: 'bigint', unsigned: true })
  productId: number;

  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Products;
}
