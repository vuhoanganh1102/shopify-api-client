import { Init } from './init.entity';
import { Column, Entity } from 'typeorm';

// import { Post } from './post.entity';

@Entity('variant_value')
export class VariantValue extends Init {
  @Column({ name: 'url', type: 'varchar', length: 500, nullable: true })
  urlImage: string;

  @Column({ name: 'pricing', type: 'decimal', precision: 10, scale: 2 })
  pricing: number;

  @Column({ name: 'available', type: 'varchar', length: 255, nullable: true })
  available: string;
}
