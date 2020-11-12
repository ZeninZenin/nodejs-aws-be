import { IsInt, IsNotEmpty, IsString, IsUrl, ValidateIf } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @IsNotEmpty({ message: 'The name is required' })
  @IsString({ message: 'The name should be a string' })
  name: string;

  @Column()
  @IsNotEmpty({ message: 'The price is required' })
  @IsInt({ message: 'The price should be a number' })
  price: number;

  @Column({ nullable: true })
  @ValidateIf(product => !!product.imgUrl)
  @IsUrl()
  imgUrl?: string;

  @Column({ nullable: true })
  @ValidateIf(product => !!product.description)
  @IsString({ message: 'The description should be a string' })
  description?: string;
}
