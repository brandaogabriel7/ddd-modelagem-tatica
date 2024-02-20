import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import ProductModel from '../../../product/repository/sequelize/product.model';
import OrderModel from './order.model';

@Table({
    tableName: 'order_items',
    timestamps: false,
    name: { singular: 'item', plural: 'items' }
})
export default class OrderItemModel extends Model {
    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @ForeignKey(() => ProductModel)
    @Column({ allowNull: false })
    declare product_id: string;

    @BelongsTo(() => ProductModel)
    declare product: ProductModel;

    @ForeignKey(() => OrderModel)
    declare order_id: string;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare price: number;

    @Column({ allowNull: false })
    declare quantity: number;

}