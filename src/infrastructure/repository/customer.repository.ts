import Customer from '../../domain/entity/customer';
import CustomerRepositoryInterface from '../../domain/repository/customer-repository.interface';
import CustomerModel from '../db/sequelize/model/customer.model';
import AddressModel from '../db/sequelize/model/address.model';
import Address from '../../domain/entity/address';
import { Transaction } from 'sequelize';

export default class CustomerRepository implements CustomerRepositoryInterface {
    async create(entity: Customer): Promise<void> {

        const customer = {
            id: entity.id,
            name: entity.name,
            active: entity.isActive(),
            reward_points: entity.rewardPoints
        };

        await CustomerModel.create(
            entity.address ? {
                ...customer,
                address: {
                    customer_id: entity.id,
                    street: entity.address.street,
                    number: entity.address.number,
                    zip_code: entity.address.zipCode,
                    neighborhood: entity.address.neighborhood,
                    city: entity.address.city,
                    state: entity.address.state
                }
            }: customer,
            {
                include: CustomerModel.associations.address
            });
    }

    async update(entity: Customer): Promise<void> {

        const customerModel = await CustomerModel.findOne({
            where: { id: entity.id },
            include: CustomerModel.associations.address
        });

        if (!customerModel) {
            throw new Error('Customer not found');
        }

        await CustomerModel.sequelize.transaction(this._updateCustomerTransaction(entity));
    }

    async find(id: string): Promise<Customer> {
        const customerModel = await CustomerModel.findOne({
            where: { id },
            include: CustomerModel.associations.address
        });
        
        if (!customerModel) {
            throw new Error('Customer not found');
        }
        
        const customer = new Customer(customerModel.id, customerModel.name);
        if (customerModel.address) {
            customer.changeAddress(new Address(
                customerModel.address.street,
                customerModel.address.number,
                customerModel.address.zip_code,
                customerModel.address.neighborhood,
                customerModel.address.city,
                customerModel.address.state));
        }
        
        if (customerModel.active) {
            customer.activate();
        }
        else {
            customer.deactivate();
        }

        return customer;
    }
    
    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll({
            include: CustomerModel.associations.address
        });
        return customerModels.map(customerModel => {
            const customer = new Customer(customerModel.id, customerModel.name);
            if (customerModel.address) {
                customer.changeAddress(new Address(
                    customerModel.address.street,
                    customerModel.address.number,
                    customerModel.address.zip_code,
                    customerModel.address.neighborhood,
                    customerModel.address.city,
                    customerModel.address.state));
            }
            
            if (customerModel.active) {
                customer.activate();
            }
            else {
                customer.deactivate();
            }
            return customer;
        });
    }
    
    private _updateCustomerTransaction(
        entity: Customer
    ): (t: Transaction) => PromiseLike<void> {
        return async (t: Transaction) => {
            if (entity.address) {
                await AddressModel.upsert({
                    customer_id: entity.id,
                    street: entity.address.street,
                    number: entity.address.number,
                    zip_code: entity.address.zipCode,
                    neighborhood: entity.address.neighborhood,
                    city: entity.address.city,
                    state: entity.address.state
                }, { transaction: t });
            }
            else {
                await AddressModel.destroy({
                    where: { customer_id: entity.id },
                    transaction: t
                });
            }

            await CustomerModel.update({
                name: entity.name,
                active: entity.isActive(),
                reward_points: entity.rewardPoints
            }, {
                where: { id: entity.id },
                transaction: t
            });
        };
    }

}