import CustomerModel from './customer.model';
import AddressModel from './address.model';
import { Sequelize } from 'sequelize-typescript';


const setupSequelizeModels = (sequelize: Sequelize) => {

    // By defining this associations in a separate file instead of using the decorators, I can avoid
    // circular dependencies between the models. This is a common problem when using the decorators.

    CustomerModel.hasOne(AddressModel, {
        foreignKey: 'customer_id'
    });
    
    AddressModel.belongsTo(CustomerModel, {
        foreignKey: 'customer_id'
    });
};


export { setupSequelizeModels };