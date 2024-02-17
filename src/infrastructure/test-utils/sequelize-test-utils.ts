import { Sequelize } from 'sequelize-typescript';
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

    return sequelize;
}

export { createSequelizeTestInstance };

