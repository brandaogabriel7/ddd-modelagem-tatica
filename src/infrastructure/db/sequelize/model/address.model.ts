import { Column, PrimaryKey, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';

@Table({
    tableName: 'addresses',
    timestamps: false,
    name: { singular: 'address', plural: 'addresses' }
})
export default class AddressModel extends Model {

    @PrimaryKey
    @Column({ allowNull: false })
    declare customer_id: string;

    @Column({ allowNull: false })
    declare street: string;

    @Column({ allowNull: false })
    declare number: number;
    
    @Column({ allowNull: false })
    declare zip_code: string;

    @Column({ allowNull: false })
    declare neighborhood: string;

    @Column({ allowNull: false })
    declare city: string;

    @Column({ allowNull: false })
    declare state: string;
}