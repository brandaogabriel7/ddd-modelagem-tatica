import Customer from '../../customer/entity/customer';
import Order from '../entity/order';
import OrderItem from '../entity/order-item';
import { v4 as uuid } from 'uuid';

export default class OrderService {
  static placeOrder(customer: Customer, orderItems: OrderItem[]): Order {
    const order = new Order(uuid(), customer.id, orderItems);
    customer.addRewardPoints(order.total() / 2);
    return order;
  }

  static total(orders: Order[]): number {
    return orders.reduce((acc, order) => acc + order.total(), 0);
  }
}
