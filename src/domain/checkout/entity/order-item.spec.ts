import OrderItem from './order-item';

describe("OrderItem unit tests", () => {

    it("should throw an error when id is empty", () => {
        expect(() => {
            new OrderItem('', 'p1', 'Item 1', 100, 2);
        }).toThrow('ID is required');
    });

    it("should throw an error when product id is empty", () => {
        expect(() => {
            new OrderItem('I123', '', 'Item 1', 100, 2);
        }).toThrow('Product ID is required');
    });

    it("should throw an error when name is empty", () => {
        expect(() => {
            new OrderItem('I123', 'p1', '', 100, 2);
        }).toThrow('Name is required');
    });

    it("should throw an error when price is less or equal to 0", () => {
        expect(() => {
            new OrderItem('I123', 'p1', 'Item 1', -3, 2);
        }).toThrow('Price must be greater than 0');

        expect(() => {
            new OrderItem('I123', 'p1', 'Item 1', 0, 2);
        }).toThrow('Price must be greater than 0');
    });
    
    it("should throw an error when quantity is less or equal to 0", () => {
        expect(() => {
            new OrderItem('I123', 'p1', 'Item 1', 100, 0);
        }).toThrow('Quantity must be greater than 0');

        expect(() => {
            new OrderItem('I123', 'p1', 'Item 1', 100, -3);
        }).toThrow('Quantity must be greater than 0');
    });
});