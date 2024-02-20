import Address from '../../../entity/address';
import Customer from '../../../entity/customer';
import CustomerAddressChangedEvent from '../customer-address-changed.event';
import SendConsoleLogHandler from './send-console-log';

describe('Send Console Log Handler Tests', () => {
    it('should send console log', () => {
        const eventHandler = new SendConsoleLogHandler();
        const consoleLogSpy = jest.spyOn(console, 'log');
        
        const customer = new Customer('1', 'Customer 1');
        customer.changeAddress(
            new Address("Rua dos Jacarandás", 3, "12345-678", "Paraíso", "São Paulo", "SP")
        );

        eventHandler.handle(new CustomerAddressChangedEvent(customer));

        expect(consoleLogSpy).toHaveBeenCalledWith(`Endereço do cliente: ${customer.id}, ${customer.name} alterado para: ${customer.address.toString()}`);
    });
});