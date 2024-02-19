import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from 'sequelize-typescript';
import CustomerModel from './customer.model';
import OrderItemModel from './order-item.model';

@Table({
    tableName: 'orders',
    timestamps: false,
    name: { singular: 'order', plural: 'orders' }
})
export default class OrderModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    declare id: string;

    @ForeignKey(() => CustomerModel)
    @Column({ allowNull: false })
    declare customer_id: string;

    @BelongsTo(() => CustomerModel)
    declare customer: CustomerModel;

    @Column({ allowNull: false })
    declare total: number;

    @HasMany(() => OrderItemModel, {
        foreignKey: 'order_id'
    })
    declare items: OrderItemModel[];
}