import { Column, PrimaryKey, Table, Model } from 'sequelize-typescript';

@Table({
  tableName: 'products',
  timestamps: false,
  name: { singular: 'product', plural: 'products' },
})
export default class ProductModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare price: number;
}
