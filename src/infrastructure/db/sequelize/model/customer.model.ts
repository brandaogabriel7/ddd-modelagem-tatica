import { Column, PrimaryKey, Table, Model } from 'sequelize-typescript';
import AddressModel from './address.model';

@Table({
    tableName: 'customers',
    timestamps: false
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
    declare rewardPoints: number;

    declare address?: AddressModel;

}