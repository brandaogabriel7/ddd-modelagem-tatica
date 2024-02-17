import { Sequelize } from 'sequelize-typescript';
import { setupSequelizeModels } from '../db/sequelize/model';
import AddressModel from '../db/sequelize/model/address.model';
import CustomerModel from '../db/sequelize/model/customer.model';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import OrderModel from '../db/sequelize/model/order.model';
import ProductModel from '../db/sequelize/model/product.model';

const createSequelizeTestInstance = (): Sequelize => {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        sync: { force: true }
    });

    sequelize.addModels([CustomerModel, AddressModel, ProductModel, OrderModel, OrderItemModel])
    setupSequelizeModels(sequelize);

    return sequelize;
}

export { createSequelizeTestInstance };

