import { Init } from './init.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Products } from './products.entity';

@Entity('variants')
export class Variants extends Init {
  @Column({ name: 'title', type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ name: 'barcode', type: 'varchar', length: 255, nullable: true })
  barcode: string;

  @Column({ name: 'sku', type: 'varchar', length: 255, nullable: true })
  sku: string;

  @Column({ name: 'url', type: 'varchar', length: 500, nullable: true })
  urlImage: string;

  @Column({
    name: 'pricing',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  pricing: number;

  @Column({ name: 'available', type: 'varchar', length: 255, nullable: true })
  available: string;

  @Column({ name: 'inventory_quantity', type: 'integer', nullable: true })
  inventoryQuantity: number;

  @Column({ name: 'old_inventory_quantity', type: 'integer', nullable: true })
  oldInventoryQuantity: number;

  @Column({ name: 'option_1', type: 'varchar', length: 255, nullable: true })
  option1: string;

  @Column({ name: 'option_2', type: 'varchar', length: 255, nullable: true })
  option2: string;

  @Column({ name: 'option_3', type: 'varchar', length: 255, nullable: true })
  option3: string;

  @Column({ name: 'product_id', type: 'bigint', unsigned: true })
  productId: number;

  @ManyToOne(() => Products)
  @JoinColumn({
    name: 'product_id',
    referencedColumnName: 'id',
  })
  product: Products;
}
