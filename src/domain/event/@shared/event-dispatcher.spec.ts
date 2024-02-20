import SendEmailWhenProductIsCreatedHandler from '../product/handler/send-email-when-product-is-created';
import ProductCreatedEvent from '../product/product-created.event';
import EventDispatcher from './event-dispatcher';

describe('Domain events tests', () => {

    it('should register event handler', () => {

        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(1);
        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toEqual([eventHandler]);
    });

    it('should unregister event handler', () => {
        
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toEqual([eventHandler]);

        eventDispatcher.unregister('ProductCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(0);
    });

    it('should unregister all event handlers', () => {
            
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toEqual([eventHandler]);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toBeUndefined();
    });

    it('should notify all event handlers', () => {
            
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, 'handle');

        eventDispatcher.register('ProductCreatedEvent', eventHandler);

        expect(eventDispatcher.getEventHandlers['ProductCreatedEvent']).toEqual([eventHandler]);

        const productCreatedEvent = new ProductCreatedEvent({
            name: 'Product 1',
            description: 'Product 1 description',
            price: 10.0
        });

        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalledWith(productCreatedEvent);
    });
});