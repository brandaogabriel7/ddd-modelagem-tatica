import { Sequelize } from 'sequelize-typescript';
import { createSequelizeTestInstance } from '../../../@shared/repository/sequelize/__mocks__/sequelize.mock';
import OrderRepository from './order.repository';
import Customer from '../../../../domain/customer/entity/customer';
import Address from '../../../../domain/customer/value-object/address';
import Product from '../../../../domain/product/entity/product';
import ProductRepository from '../../../product/repository/sequelize/product.repository';
import OrderItem from '../../../../domain/checkout/entity/order-item';
import Order from '../../../../domain/checkout/entity/order';
import OrderModel from './order.model';
import OrderItemModel from './order-item.model';
import ProductModel from '../../../product/repository/sequelize/product.model';
import AddressModel from '../../../customer/repository/sequelize/address.model';
import CustomerModel from '../../../customer/repository/sequelize/customer.model';
import CustomerRepository from '../../../customer/repository/sequelize/customer.repository';

describe('Order repository tests', () => {
  let sequelize: Sequelize;
  let orderRepository: OrderRepository;
  let customerRepository: CustomerRepository;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    sequelize = createSequelizeTestInstance();

    sequelize.addModels([
      OrderModel,
      AddressModel,
      CustomerModel,
      ProductModel,
      OrderItemModel,
    ]);

    await sequelize.sync();

    orderRepository = new OrderRepository();
    customerRepository = new CustomerRepository();
    productRepository = new ProductRepository();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('should create a new order', async () => {
    const customer = new Customer('123', 'Customer 1');
    const address = new Address(
      'Rua Paraíba',
      123,
      '12345-678',
      'Savassi',
      'Belo Horizonte',
      'Minas Gerais',
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const product = new Product('123', 'Product 1', 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      '1',
      product.id,
      product.name,
      product.price,
      2,
    );

    const order = new Order('123', customer.id, [orderItem]);

    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: OrderModel.associations.items,
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
          quantity: orderItem.quantity,
        },
      ],
    });
  });

  it('should update an existing order', async () => {
    const customer = new Customer('123', 'Customer 1');
    const address = new Address(
      'Rua Paraíba',
      123,
      '12345-678',
      'Savassi',
      'Belo Horizonte',
      'Minas Gerais',
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const product = new Product('123', 'Product 1', 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      '1',
      product.id,
      product.name,
      product.price,
      2,
    );

    const order = new Order('123', customer.id, [orderItem]);

    await orderRepository.create(order);

    const newProduct = new Product('456', 'Product 2', 200);
    await productRepository.create(newProduct);

    const newOrderItem = new OrderItem(
      '2',
      newProduct.id,
      newProduct.name,
      newProduct.price,
      3,
    );

    order.updateItems([orderItem, newOrderItem]);

    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: OrderModel.associations.items,
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
          quantity: orderItem.quantity,
        },
        {
          id: newOrderItem.id,
          order_id: order.id,
          product_id: newOrderItem.productId,
          name: newOrderItem.name,
          price: newOrderItem.price,
          quantity: newOrderItem.quantity,
        },
      ],
    });

    order.updateItems([newOrderItem]);

    await orderRepository.update(order);

    const updatedOrderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: OrderModel.associations.items,
    });

    expect(updatedOrderModel.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: customer.id,
      total: order.total(),
      items: [
        {
          id: newOrderItem.id,
          order_id: order.id,
          product_id: newOrderItem.productId,
          name: newOrderItem.name,
          price: newOrderItem.price,
          quantity: newOrderItem.quantity,
        },
      ],
    });
  });

  it('should throw an error when trying to update a non-existing order', async () => {
    const orderItem = new OrderItem('1', '123', 'Product 1', 100, 2);
    const order = new Order('123', '123', [orderItem]);

    await expect(orderRepository.update(order)).rejects.toThrow(
      'Order not found',
    );
  });

  it('should find an existing order', async () => {
    const customer = new Customer('123', 'Customer 1');
    const address = new Address(
      'Rua Paraíba',
      123,
      '12345-678',
      'Savassi',
      'Belo Horizonte',
      'Minas Gerais',
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const product = new Product('123', 'Product 1', 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      '1',
      product.id,
      product.name,
      product.price,
      2,
    );

    const order = new Order('123', customer.id, [orderItem]);

    await orderRepository.create(order);

    const foundOrder = await orderRepository.find(order.id);

    expect(foundOrder).toStrictEqual(order);
  });

  it('should throw an error when trying to find a non-existing order', async () => {
    await expect(orderRepository.find('123')).rejects.toThrow(
      'Order not found',
    );
  });

  it('should find all orders', async () => {
    const customer = new Customer('123', 'Customer 1');
    const address = new Address(
      'Rua Paraíba',
      123,
      '12345-678',
      'Savassi',
      'Belo Horizonte',
      'Minas Gerais',
    );
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const product = new Product('123', 'Product 1', 100);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      '1',
      product.id,
      product.name,
      product.price,
      2,
    );

    const order = new Order('123', customer.id, [orderItem]);

    await orderRepository.create(order);

    const product2 = new Product('456', 'Product 2', 200);
    await productRepository.create(product2);

    const orderItem2 = new OrderItem(
      '2',
      product2.id,
      product2.name,
      product2.price,
      3,
    );

    const order2 = new Order('456', customer.id, [orderItem2]);
    await orderRepository.create(order2);

    const orders = await orderRepository.findAll();

    expect(orders).toStrictEqual([order, order2]);
  });
});
