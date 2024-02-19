import { Sequelize } from 'sequelize-typescript';
import ProductModel from '../../db/sequelize/model/product.model';
import { v4 as uuid } from 'uuid';
import CustomerModel from '../../db/sequelize/model/customer.model';
import OrderModel from '../../db/sequelize/model/order.model';

const createSequelizeTestInstance = (): Sequelize => {
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        sync: { force: true }
    });

    return sequelize;
};

const addRandomTestProductsToDatabase = async () => {
    await ProductModel.bulkCreate([
        { id: uuid(), name: 'Random Product 1', price: Math.random() * 100 },
        { id: uuid(), name: 'Random Product 2', price: Math.random() * 100 },
        { id: uuid(), name: 'Random Product 3', price: Math.random() * 100 },
        { id: uuid(), name: 'Random Product 4', price: Math.random() * 100 },
        { id: uuid(), name: 'Random Product 5', price: Math.random() * 100 }
    ]);
};

const addRandomTestCustomersToDatabase = async () => {
    await CustomerModel.bulkCreate([
        { id: uuid(), name: 'Random Customer 1', active: false, reward_points: Math.random() * 100 },
        { id: uuid(), name: 'Random Customer 2', active: false, reward_points: Math.random() * 100 },
        { id: uuid(), name: 'Random Customer 3', active: false, reward_points: Math.random() * 100 },
        { id: uuid(), name: 'Random Customer 4', active: false, reward_points: Math.random() * 100 },
        { id: uuid(), name: 'Random Customer 5', active: false, reward_points: Math.random() * 100 }
    ]);
};

const addRandomTestOrdersToDatabase = async () => {
    for (let i = 0; i < 5; i++) {
        const customerModel = await CustomerModel.create({
            id: uuid(),
            name: `Random Customer ${i + 1}`,
            active: false,
            reward_points: Math.random() * 100
        });

        const productModel = await ProductModel.create({
            id: uuid(),
            name: `Random Product ${i + 1}`,
            price: Math.random() * 100
        });

        const orderId = uuid();
        await OrderModel.create({
            id: orderId,
            customer_id: customerModel.id,
            total: productModel.price,
            items: [
                {
                    id: uuid(),
                    order_id: orderId,
                    product_id: productModel.id,
                    quantity: 1,
                    price: productModel.price
                }
            ]
        });
    }
};

export {
    createSequelizeTestInstance,
    addRandomTestProductsToDatabase,
    addRandomTestCustomersToDatabase,
    addRandomTestOrdersToDatabase
};

