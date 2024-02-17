import { Sequelize } from 'sequelize-typescript';
import { createSequelizeTestInstance } from '../test-utils/sequelize-test-utils';
import OrderRepository from './order.repository';
import Customer from '../../domain/entity/customer';
import Address from '../../domain/entity/address';
import CustomerRepository from './customer.repository';
import Product from '../../domain/entity/product';
import ProductRepository from './product.repository';
import OrderItem from '../../domain/entity/order-item';
import Order from '../../domain/entity/order';
import OrderModel from '../db/sequelize/model/order.model';

describe('Order repository tests', () => {
    let sequelize: Sequelize;
    let orderRepository: OrderRepository;
    let customerRepository: CustomerRepository;
    let productRepository: ProductRepository;

    beforeEach(async () => {
        sequelize = createSequelizeTestInstance();

        await sequelize.sync();

        orderRepository = new OrderRepository(sequelize);
        customerRepository = new CustomerRepository(sequelize);
        productRepository = new ProductRepository(sequelize);
    });
    
    afterEach(async () => {
        await sequelize.close();
    });

    it('should create a new order', async () => {
        const customer = new Customer('123', 'Customer 1');
        const address = new Address('Rua Paraíba', 123, '12345-678', 'Savassi', 'Belo Horizonte', 'Minas Gerais');
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const product = new Product('123', 'Product 1', 100);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            '1',
            product.id,
            product.name,
            product.price,
            2
        );

        const order = new Order('123', customer.id, [orderItem]);

        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: OrderModel.associations.items
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    order_id: order.id,
                    product_id: orderItem.productId,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity
                }
            ]
        });

    });

});