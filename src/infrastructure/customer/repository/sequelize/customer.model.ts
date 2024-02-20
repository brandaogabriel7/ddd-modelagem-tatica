import { Column, PrimaryKey, Table, Model, HasOne } from 'sequelize-typescript';
import AddressModel from './address.model';

@Table({
    tableName: 'customers',
    timestamps: false,
    name: { singular: 'customer', plural: 'customers' }
})
export default class CustomerModel extends Model {
    
    @PrimaryKey
    @Column
    declare id: string;

    @Column({ allowNull: false })
    declare name: string;

    @Column({ allowNull: false })
    declare active: boolean;

    @Column({ allowNull: false })
    declare reward_points: number;
    
    @HasOne(() => AddressModel, {
        foreignKey: 'customer_id'
    })
    declare address?: AddressModel;
}