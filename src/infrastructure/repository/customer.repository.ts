import Customer from '../../domain/entity/customer';
import CustomerRepositoryInterface from '../../domain/repository/customer-repository.interface';
import CustomerModel from '../db/sequelize/model/customer.model';
import AddressModel from '../db/sequelize/model/address.model';
import Address from '../../domain/entity/address';
import { Sequelize } from 'sequelize-typescript';

export default class CustomerRepository implements CustomerRepositoryInterface {
    private _customerModel: typeof CustomerModel;
    private _addressModel: typeof AddressModel;


    constructor(sequelize: Sequelize) {
        this._customerModel = sequelize.models.CustomerModel as typeof CustomerModel;
        this._addressModel = sequelize.models.AddressModel as typeof AddressModel;
    }

    async create(entity: Customer): Promise<void> {

        const customer = {
            id: entity.id,
            name: entity.name,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints
        };

        await this._customerModel.create(
            entity.address ? {
                ...customer,
                address: {
                    customerId: entity.id,
                    street: entity.address.street,
                    number: entity.address.number,
                    zipCode: entity.address.zipCode,
                    city: entity.address.city,
                    state: entity.address.state
                }
            }: customer,
            {
                include: [{ model:this._addressModel, as: 'address' }]
            });
    }

    async update(entity: Customer): Promise<void> {
        await this._customerModel.update({
            name: entity.name,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints
        }, {
            where: { id: entity.id }
        });

        if (entity.address) {
            const previousAddress = await this._addressModel.findOne({ where: { customerId: entity.id } });
            if (!previousAddress) {
                await this._addressModel.create({
                    customerId: entity.id,
                    street: entity.address.street,
                    number: entity.address.number,
                    zipCode: entity.address.zipCode,
                    city: entity.address.city,
                    state: entity.address.state
                });
            }
            else {
                await this._addressModel.update({
                    street: entity.address.street,
                    number: entity.address.number,
                    zipCode: entity.address.zipCode,
                    city: entity.address.city,
                    state: entity.address.state
                }, {
                    where: { customerId: entity.id }
                });
            }
        }
    }

    async find(id: string): Promise<Customer> {
        const customerModel = await this._customerModel.findOne({
            where: { id }
        });
        
        if (!customerModel) {
            throw new Error('Customer not found');
        }
        
        const customer = new Customer(customerModel.id, customerModel.name);
        if (customerModel.address) {
            customer.changeAddress(new Address(customerModel.address.street, customerModel.address.number, customerModel.address.zipCode, customerModel.address.city, customerModel.address.state));
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
        const customerModels = await this._customerModel.findAll();
        return customerModels.map(customerModel => {
            const customer = new Customer(customerModel.id, customerModel.name);
            if (customerModel.address) {
                customer.changeAddress(new Address(customerModel.address.street, customerModel.address.number, customerModel.address.zipCode, customerModel.address.city, customerModel.address.state));
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