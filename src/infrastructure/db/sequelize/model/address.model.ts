import { Column, PrimaryKey, Model, ForeignKey, Table } from 'sequelize-typescript';
import CustomerModel from './customer.model';

@Table({
    tableName: 'addresses',
    timestamps: false
})
export default class AddressModel extends Model {
    
    @PrimaryKey
    @ForeignKey(() => CustomerModel)
    @Column
    declare customerId: string;

    @Column({ allowNull: false })
    declare street: string;

    @Column({ allowNull: false })
    declare number: number;
    
    @Column({ allowNull: false })
    declare zipCode: string;

    @Column({ allowNull: false })
    declare city: string;

    @Column({ allowNull: false })
    declare state: string;

}