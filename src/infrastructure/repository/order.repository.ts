import { Transaction } from 'sequelize';
import Order from '../../domain/entity/order';
import OrderRepositoryInterface from '../../domain/repository/order-repository.interface';
import OrderItemModel from '../db/sequelize/model/order-item.model';
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

    async update(entity: Order): Promise<void> {
        const orderModel = await OrderModel.findOne({
            where: { id: entity.id },
            include: OrderModel.associations.items
        });

        if (!orderModel) {
            throw new Error('Order not found');
        }

        await OrderModel.sequelize.transaction(
            this._updateOrderTransaction(entity, orderModel));

        await orderModel.update({
            customer_id: entity.customerId,
            total: entity.total()
        });

    }

    find(id: string): Promise<Order> {
        throw new Error('Method not implemented.');
    }
    findAll(): Promise<Order[]> {
        throw new Error('Method not implemented.');
    }

    private _updateOrderTransaction(
        entity: Order,
        orderModel:
        OrderModel
    ): (t: Transaction) => PromiseLike<void> {
        return async (t: Transaction) => {

            for (const item of entity.items) {
                const existingItem = orderModel.items.find(i => i.id === item.id);
                if (existingItem) {
                    await existingItem.update({
                        product_id: item.productId,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    }, { transaction: t });
                }
                else {
                    await OrderItemModel.create({
                        id: item.id,
                        product_id: item.productId,
                        order_id: entity.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity
                    }, { transaction: t });
                }
    
                for (const item of orderModel.items) {
                    if (!entity.items.some(i => i.id === item.id)) {
                        await item.destroy({ transaction: t });
                    }
                }
    
                await orderModel.update({
                    customer_id: entity.customerId,
                    total: entity.total()
                }, { transaction: t });
            }
        };
    }

}