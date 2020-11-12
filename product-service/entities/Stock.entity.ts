import { IsInt, IsNotEmpty } from 'class-validator';
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Product } from './Product.entity';

@Entity({ name: 'stocks' })
export class Stock {
  @PrimaryColumn('uuid')
  productId: string;

  @Column()
  @IsNotEmpty({ message: 'The count is required' })
  @IsInt({ message: 'The count should be a number' })
  count: number;

  @OneToOne(() => Product, { cascade: true })
  @JoinColumn({ name: 'productId' })
  product: Product;
}
