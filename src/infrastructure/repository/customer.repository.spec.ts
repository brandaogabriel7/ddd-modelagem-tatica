import { Sequelize } from 'sequelize-typescript';
import Customer from '../../domain/entity/customer';
import CustomerModel from '../db/sequelize/model/customer.model';
import CustomerRepository from './customer.repository';
import { createSequelizeTestInstance } from '../test-utils/sequelize-test-utils';
import Address from '../../domain/entity/address';
import AddressModel from '../db/sequelize/model/address.model';

describe("Customer Repository test", () => {
    let sequelize: Sequelize;
    let customerRepository: CustomerRepository;

    beforeEach(async () => {
        sequelize = createSequelizeTestInstance();

        sequelize.addModels([CustomerModel, AddressModel]);

        await sequelize.sync();

        customerRepository = new CustomerRepository();
    });
    
    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const customer1 = new Customer('1', 'John Doe');

        await customerRepository.create(customer1);

        const customerModel = await CustomerModel.findOne({
            where: { id: customer1.id },
            include: CustomerModel.associations.address
        });

        expect(customerModel.toJSON()).toEqualIgnoringNull({
            id: customer1.id,
            name: customer1.name,
            active: customer1.isActive(),
            reward_points: customer1.rewardPoints
        });

        const customer2 = new Customer('2', 'Jane Doe');
        customer2.changeAddress(new Address('Rua Paraíba', 123, '12345-678', 'Savassi', 'Belo Horizonte', 'Minas Gerais'));
        customer2.activate();

        await customerRepository.create(customer2);

        const customerModel2 = await CustomerModel.findOne({
            where: { id: customer2.id },
            include: CustomerModel.associations.address
        });

        expect(customerModel2.toJSON()).toEqualIgnoringNull({
            id: customer2.id,
            name: customer2.name,
            active: customer2.isActive(),
            reward_points: customer2.rewardPoints,
            address: {
                customer_id: customer2.id,
                street: customer2.address.street,
                number: customer2.address.number,
                zip_code: customer2.address.zipCode,
                neighborhood: customer2.address.neighborhood,
                city: customer2.address.city,
                state: customer2.address.state
            }
        });
        
    });

    it("should update a customer", async () => {
        // create a customer
        const customer = new Customer('1', 'John Doe');

        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({
            where: { id: customer.id },
            include: CustomerModel.associations.address
        });

        expect(customerModel.toJSON()).toEqualIgnoringNull({
            id: customer.id,
            name: customer.name,
            active: customer.isActive(),
            reward_points: customer.rewardPoints
        });

        // update the customer, setting the address for the first time
        customer.changeName('Jane Doe');
        customer.changeAddress(new Address('Rua Paraíba', 123, '12345-678', 'Savassi', 'Belo Horizonte', 'Minas Gerais'));
        customer.activate();

        await customerRepository.update(customer);

        const updatedCustomerModel = await CustomerModel.findOne({
            where: { id: customer.id },
            include: CustomerModel.associations.address
        });

        expect(updatedCustomerModel.toJSON()).toEqualIgnoringNull({
            id: customer.id,
            name: customer.name,
            active: customer.isActive(),
            reward_points: customer.rewardPoints,
            address: {
                customer_id: customer.id,
                street: customer.address.street,
                number: customer.address.number,
                zip_code: customer.address.zipCode,
                neighborhood: customer.address.neighborhood,
                city: customer.address.city,
                state: customer.address.state
            }
        });

        // updating the existing address
        customer.changeAddress(new Address('Rua Brasília', 456, '12345-678', 'Savassi', 'Belo Horizonte', 'Minas Gerais'));

        await customerRepository.update(customer);

        const updatedAgainCustomerModel = await CustomerModel.findOne({
            where: { id: customer.id },
            include: CustomerModel.associations.address
        });

        expect(updatedAgainCustomerModel.toJSON()).toEqualIgnoringNull({
            id: customer.id,
            name: customer.name,
            active: customer.isActive(),
            reward_points: customer.rewardPoints,
            address: {
                customer_id: customer.id,
                street: customer.address.street,
                number: customer.address.number,
                zip_code: customer.address.zipCode,
                neighborhood: customer.address.neighborhood,
                city: customer.address.city,
                state: customer.address.state
            }
        });

    });

    it("should find a customer", async () => {
        const customer = new Customer('1', 'John Doe');

        await customerRepository.create(customer);

        const foundCustomer = await customerRepository.find(customer.id);

        const customerModel = await CustomerModel.findOne({
            where: { id: customer.id },
            include: CustomerModel.associations.address
        });
        expect(customerModel.toJSON()).toEqualIgnoringNull({
            id: foundCustomer.id,
            name: foundCustomer.name,
            active: foundCustomer.isActive(),
            reward_points: foundCustomer.rewardPoints
        });

        customer.changeAddress(new Address('Rua Paraíba', 123, '12345-678', 'Savassi', 'Belo Horizonte', 'Minas Gerais'));
        customer.activate();

        await customerRepository.update(customer);

        const foundCustomer2 = await customerRepository.find(customer.id);
        
        const customerModel2 = await CustomerModel.findOne({
            where: { id: customer.id },
            include: CustomerModel.associations.address
        });
        expect(customerModel2.toJSON()).toEqualIgnoringNull({
            id: foundCustomer2.id,
            name: foundCustomer2.name,
            active: foundCustomer2.isActive(),
            reward_points: foundCustomer2.rewardPoints,
            address: {
                customer_id: foundCustomer2.id,
                street: foundCustomer2.address.street,
                number: foundCustomer2.address.number,
                zip_code: foundCustomer2.address.zipCode,
                neighborhood: foundCustomer2.address.neighborhood,
                city: foundCustomer2.address.city,
                state: foundCustomer2.address.state
            }
        });
    });

    it("should find all customers", async () => {
        const customer1 = new Customer('1', 'John Doe');
        await customerRepository.create(customer1);

        const customer2 = new Customer('2', 'Jane Doe');
        customer2.changeAddress(new Address('Rua Paraíba', 123, '12345-678', 'Savassi', 'Belo Horizonte', 'Minas Gerais'));
        customer2.activate();
        await customerRepository.create(customer2);

        const foundCustomers = await customerRepository.findAll();

        const customers = [customer1, customer2];

        expect(foundCustomers).toStrictEqual(customers);
    });

    it("should throw an error when trying to find a non-existing customer", async () => {
        await expect(customerRepository.find('1')).rejects.toThrow('Customer not found');
    });
});