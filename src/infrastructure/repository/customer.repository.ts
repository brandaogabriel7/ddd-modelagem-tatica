import Customer from '../../domain/entity/customer';
import CustomerRepositoryInterface from '../../domain/repository/customer-repository.interface';
import CustomerModel from '../db/sequelize/model/customer.model';
import AddressModel from '../db/sequelize/model/address.model';
import Address from '../../domain/entity/address';

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
        await CustomerModel.update({
            name: entity.name,
            active: entity.isActive(),
            reward_points: entity.rewardPoints
        }, {
            where: { id: entity.id }
        });

        if (entity.address) {
            const previousAddress = await AddressModel.findOne(
                { where: { customer_id: entity.id } });
            if (!previousAddress) {
                await AddressModel.create({
                    customer_id: entity.id,
                    street: entity.address.street,
                    number: entity.address.number,
                    zip_code: entity.address.zipCode,
                    neighborhood: entity.address.neighborhood,
                    city: entity.address.city,
                    state: entity.address.state
                });
            }
            else {
                await AddressModel.update({
                    street: entity.address.street,
                    number: entity.address.number,
                    zip_code: entity.address.zipCode,
                    neighborhood: entity.address.neighborhood,
                    city: entity.address.city,
                    state: entity.address.state
                }, {
                    where: { customer_id: entity.id }
                });
            }
        }
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
    
}