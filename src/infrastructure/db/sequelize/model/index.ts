import CustomerModel from './customer.model';
import AddressModel from './address.model';
import ProductModel from './product.model';
import { Sequelize } from 'sequelize-typescript';


const addSequelizeModels = (sequelize: Sequelize) => {
    sequelize.addModels([CustomerModel, AddressModel, ProductModel]);

    // By defining this associations in a separate file instead of using the decorators, I can avoid
    // circular dependencies between the models. This is a common problem when using the decorators.
    
    CustomerModel.hasOne(AddressModel, {
        sourceKey: 'id',
        foreignKey: 'customerId',
        as: 'address'
    });

    
    AddressModel.belongsTo(CustomerModel, {
        targetKey: 'id',
        foreignKey: 'customerId',
        as: 'customer'
    });

    // Always includes the address when querying for a customer
    CustomerModel.addScope('defaultScope', {
        include: [{ model: AddressModel, as: 'address' }]
    }, { override: true });
};


export { addSequelizeModels };