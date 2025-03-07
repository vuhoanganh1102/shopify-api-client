import { Init } from './init.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OptionVariant } from './optionVariant.entity';
import { VariantValue } from './variantValue.entity';
import { Products } from './products.entity';

@Entity('variants')
export class Variants extends Init {
  @Column({ name: 'product_id', type: 'bigint', unsigned: true })
  productId: number;

  @ManyToOne(() => Products)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product: Products;

  @Column({ name: 'option_variant_id', type: 'bigint', unsigned: true })
  optionVariantId: number;

  @ManyToOne(() => OptionVariant)
  @JoinColumn({ name: 'option_variant_id', referencedColumnName: 'id' })
  optionVariant: OptionVariant;

  @Column({ name: 'value_variant_id', type: 'bigint', unsigned: true })
  valueVariantId: number;

  @ManyToOne(() => VariantValue)
  @JoinColumn({ name: 'value_variant_id', referencedColumnName: 'id' })
  variantValue: VariantValue;
}
