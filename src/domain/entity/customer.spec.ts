import { addRandomTestCustomersToDatabase } from '../../infrastructure/repository/__mocks__/sequelize.mock';
import Address from "./address";
import Customer from "./customer";

describe("Customer unit tests", () => {

    it("should throw an error when id is empty", () => {
        expect(() => {
            new Customer('', 'John Doe');
        }).toThrow('ID is required');
    });

    it("should throw an error when name is empty", () => {
        expect(() => {
            new Customer('123', '');
        }).toThrow('Name is required');
    });

    it("should change the name", () => {
        const customer = new Customer('123', 'John Doe');

        customer.changeName('Jane Doe');

        expect(customer.name).toBe('Jane Doe');
    });

    it("should activate the customer", () => {
        const customer = new Customer('123', 'John Doe');

        const address = new Address("Rua dos Jacarandás", 3, "12345-678", "Paraíso", "São Paulo", "SP");
        customer.changeAddress(address);

        customer.activate();

        expect(customer.isActive()).toBe(true);
    });

    it("should throw error when trying to activate client that has no address", () => {
        
        expect(() => {
            const customer = new Customer('123', 'John Doe');
            
            customer.activate();
        }).toThrow('Address is required to activate customer');
    });

    it("should deactivate the customer", () => {
        const customer = new Customer('123', 'John Doe');

        expect(customer.isActive()).toBe(false);

        customer.changeAddress(
            new Address("Rua dos Jacarandás", 3, "12345-678", "Paraíso", "São Paulo", "SP")
        );
        customer.activate();

        expect(customer.isActive()).toBe(true);

        customer.deactivate();

        expect(customer.isActive()).toBe(false);
    });

    it("should throw an error when trying to add reward points that are not greater than 0", () => {
        
        expect(() => {
            const customer = new Customer('123', 'John Doe');
            customer.addRewardPoints(0);
        }).toThrow('Reward points must be greater than 0');

        expect(() => {
            const customer = new Customer('123', 'John Doe');
            customer.addRewardPoints(-1);
        }).toThrow('Reward points must be greater than 0');
    });

    it("should add reward points", () => {
        const customer = new Customer('123', 'John Doe');

        expect(customer.rewardPoints).toBe(0);
        
        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(5);
        expect(customer.rewardPoints).toBe(15);
    });

    it('should throw an error when trying to remove the address from an active customer', () => {
        expect(() => {
            const customer = new Customer('1', 'John Doe');
            customer.changeAddress(
                new Address("Rua dos Jacarandás", 3, "12345-678", "Paraíso", "São Paulo", "SP")
            );
            customer.activate();

            customer.changeAddress(undefined);
        }).toThrow('Cannot remove address from an active customer');

        expect(() => {
            const customer = new Customer('1', 'John Doe');
            customer.changeAddress(
                new Address("Rua dos Jacarandás", 3, "12345-678", "Paraíso", "São Paulo", "SP")
            );
            customer.activate();

            customer.changeAddress(null);
        }).toThrow('Cannot remove address from an active customer');
    });

});