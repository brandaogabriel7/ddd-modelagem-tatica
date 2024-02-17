import CustomerModel from './customer.model';
import AddressModel from './address.model';
import ProductModel from './product.model';
import { Sequelize } from 'sequelize-typescript';
import OrderItemModel from './order-item.model';
import OrderModel from './order.model';
import Order from '../../../../domain/entity/order';


const setupSequelizeModels = (sequelize: Sequelize) => {
    sequelize.addModels([CustomerModel, AddressModel, ProductModel, OrderModel, OrderItemModel]);

    // By defining this associations in a separate file instead of using the decorators, I can avoid
    // circular dependencies between the models. This is a common problem when using the decorators.

    CustomerModel.hasOne(AddressModel, {
        foreignKey: 'customer_id'
    });
    
    AddressModel.belongsTo(CustomerModel, {
        foreignKey: 'customer_id'
    });
};


export { setupSequelizeModels as addSequelizeModels };