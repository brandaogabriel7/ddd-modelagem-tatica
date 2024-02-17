import { Sequelize } from 'sequelize-typescript';
import Order from '../../domain/entity/order';
import OrderRepositoryInterface from '../../domain/repository/order-repository.interface';
import OrderModel from '../db/sequelize/model/order.model';
import OrderItemModel from '../db/sequelize/model/order-item.model';

export default class OrderRepository implements OrderRepositoryInterface {
    private _orderModel: typeof OrderModel;
    private _orderItemModel: typeof OrderItemModel;

    constructor(sequelize: Sequelize) {
        this._orderModel = sequelize.models.OrderModel as typeof OrderModel;
        this._orderItemModel = sequelize.models.OrderItemModel as typeof OrderItemModel;
    }

    async create(entity: Order): Promise<void> {
        await this._orderModel.create({
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
            include: ["items"]
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