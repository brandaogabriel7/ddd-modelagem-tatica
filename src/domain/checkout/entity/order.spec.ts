import Order from './order';
import OrderItem from './order-item';

describe('Order unit tests', () => {
  it('should throw an error when id is empty', () => {
    expect(() => {
      new Order('', 'Customer 123', []);
    }).toThrow('ID is required');
  });

  it('should throw an error when customer id is empty', () => {
    expect(() => {
      new Order('Order 123', '', []);
    }).toThrow('Customer ID is required');
  });

  it('should throw an error when order has no items', () => {
    expect(() => {
      new Order('Order 123', 'Customer 123', []);
    }).toThrow('Order must have at least one item');
  });

  it('should calculate the total', () => {
    const item1 = new OrderItem('I123', 'p1', 'Item 1', 100, 2);
    const item2 = new OrderItem('I456', 'p2', 'Item 2', 200, 3);
    const order = new Order('Order 123', 'Customer 123', [item1]);

    expect(order.total()).toBe(200);

    const order2 = new Order('Order 234', 'Customer 123', [item1, item2]);

    expect(order2.total()).toBe(800);
  });
});
