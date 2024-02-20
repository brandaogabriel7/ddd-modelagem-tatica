import Address from '../../customer/value-object/address';
import Customer from '../../customer/entity/customer';
import CustomerAddressChangedEvent from '../../customer/event/customer-address-changed.event';
import CustomerCreatedEvent from '../../customer/event/customer-created.event';
import SendConsoleLogHandler from '../../customer/event/handler/send-console-log';
import SendConsoleLog1Handler from '../../customer/event/handler/send-console-log-1';
import SendConsoleLog2Handler from '../../customer/event/handler/send-console-log-2';
import SendEmailWhenProductIsCreatedHandler from '../../product/event/handler/send-email-when-product-is-created';
import ProductCreatedEvent from '../../product/event/product-created.event';
import EventDispatcher from './event-dispatcher';

describe('Domain events tests', () => {

    it.each([
        ['ProductCreatedEvent', new SendEmailWhenProductIsCreatedHandler()],
        ['CustomerCreatedEvent', new SendConsoleLog1Handler()],
        ['CustomerCreatedEvent', new SendConsoleLog2Handler()],
        ['CustomerAddressChangedEvent', new SendConsoleLogHandler()]
    ])('should register handler for %s', (eventName, eventHandler) => {

        const eventDispatcher = new EventDispatcher();

        eventDispatcher.register(eventName, eventHandler);

        expect(eventDispatcher.getEventHandlers[eventName].length).toBe(1);
        expect(eventDispatcher.getEventHandlers[eventName]).toEqual([eventHandler]);
    });

    it.each([
        ['ProductCreatedEvent', new SendEmailWhenProductIsCreatedHandler()],
        ['CustomerCreatedEvent', new SendConsoleLog1Handler()],
        ['CustomerCreatedEvent', new SendConsoleLog2Handler()],
        ['CustomerAddressChangedEvent', new SendConsoleLogHandler()]
    ])('should unregister handler for %s', (eventName, eventHandler) => {
        
        const eventDispatcher = new EventDispatcher();

        eventDispatcher.register(eventName, eventHandler);

        expect(eventDispatcher.getEventHandlers[eventName]).toEqual([eventHandler]);

        eventDispatcher.unregister(eventName, eventHandler);

        expect(eventDispatcher.getEventHandlers[eventName].length).toBe(0);
    });

    it('should unregister all event handlers', () => {
            
        const eventDispatcher = new EventDispatcher();
        const sendEmailWhenProductIsCreatedHandler = new SendEmailWhenProductIsCreatedHandler();
        const sendConsoleLog1Handler = new SendConsoleLog1Handler();
        const sendConsoleLog2Handler = new SendConsoleLog2Handler();
        const sendConsoleLogHandler = new SendConsoleLogHandler();
        eventDispatcher.register('ProductCreatedEvent', sendEmailWhenProductIsCreatedHandler);
        eventDispatcher.register('CustomerCreatedEvent', sendConsoleLog1Handler);
        eventDispatcher.register('CustomerCreatedEvent', sendConsoleLog2Handler);
        eventDispatcher.register('CustomerAddressChangedEvent', sendConsoleLogHandler);


        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toEqual([sendEmailWhenProductIsCreatedHandler]);
        expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent']).toEqual([sendConsoleLog1Handler, sendConsoleLog2Handler]);
        expect(eventDispatcher.getEventHandlers['CustomerAddressChangedEvent']).toEqual([sendConsoleLogHandler]);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeUndefined();
        expect(eventDispatcher.getEventHandlers['CustomerCreatedEvent']).toBeUndefined();
        expect(eventDispatcher.getEventHandlers['CustomerAddressChangedEvent']).toBeUndefined();
    });

    it.each([
        [
            'ProductCreatedEvent',
            [new SendEmailWhenProductIsCreatedHandler()],
            new ProductCreatedEvent({
                name: 'Product 1',
                description: 'Product 1 description',
                price: 10.0
            })
        ],
        [
            'CustomerCreatedEvent',
            [new SendConsoleLog1Handler(), new SendConsoleLog2Handler()],
            new CustomerCreatedEvent(new Customer('1', 'Customer 1'))
        ],
        [
            'CustomerAddressChangedEvent',
            [new SendConsoleLogHandler()],
            createCustomerWithAddress()
        ]
    ])('should notify all event handlers for %s', (eventName, eventHandlers, event) => {
            
        const eventDispatcher = new EventDispatcher();
        const spies = [];

        for (const eventHandler of eventHandlers) {
            eventDispatcher.register(eventName, eventHandler);
            spies.push(jest.spyOn(eventHandler, 'handle'));
        }

        eventDispatcher.notify(event);

        for (const spy of spies) {
            expect(spy).toHaveBeenCalledWith(event);
        }
    });
});

function createCustomerWithAddress(): ProductCreatedEvent {
    const customer = new Customer('1', 'Customer 1')
    customer.changeAddress(
        new Address("Rua dos Jacarandás", 3, "12345-678", "Paraíso", "São Paulo", "SP")
    );
    return new CustomerAddressChangedEvent(customer);
}
