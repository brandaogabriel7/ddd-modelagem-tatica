import Customer from '../../../entity/customer';
import CustomerCreatedEvent from '../customer-created.event';
import SendConsoleLog1Handler from './send-console-log-1';

describe('Send Console Log 1 Handler tests', () => {
    it('should send console log', () => {
        const eventHandler = new SendConsoleLog1Handler();
        const consoleLogSpy = jest.spyOn(console, 'log');
        

        const customer = new Customer('1', 'Customer 1');

        eventHandler.handle(new CustomerCreatedEvent(customer));

        expect(consoleLogSpy).toHaveBeenCalledWith('Esse é o primeiro console.log do evento: CustomerCreated');
    });
});