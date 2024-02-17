import Order from '../../domain/entity/order';
import OrderRepositoryInterface from '../../domain/repository/order-repository.interface';
import OrderModel from '../db/sequelize/model/order.model';

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map(item => ({
                id: item.id,
                product_id: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity
            }))
        }, {
            include: OrderModel.associations.items
        });
    }

    update(entity: Order): Promise<void> {
        throw new Error('Method not implemented.');
    }
    find(id: string): Promise<Order> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<Order[]> {
        throw new Error('Method not implemented.');
    }

}