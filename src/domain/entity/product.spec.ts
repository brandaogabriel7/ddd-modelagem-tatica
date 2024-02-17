import Product from './product';

describe("Product unit tests", () => {

    it("should throw an error when id is empty", () => {
        expect(() => {

            new Product('', 'Product 1', 100);
            
        }).toThrow('ID is required');
    });

    it("should throw an error when name is empty", () => {
        expect(() => {

            new Product('Product 123', '', 100);

        }).toThrow('Name is required');
    });

    it("should throw an error when price is less or equal to 0", () => {
        expect(() => {

            new Product('Product 123', 'Product 1', -3);

        }).toThrow('Price must be greater than 0');

        expect(() => {

            new Product('Product 123', 'Product 1', 0);

        }).toThrow('Price must be greater than 0');
    });

    it("should change name", () => {
        const product = new Product('Product 123', 'Product 1', 100);

        product.changeName('Product 2');

        expect(product.name).toBe('Product 2');
    });

    it("should not change name when it is empty", () => {
        expect(() => {

            const product = new Product('Product 123', 'Product 1', 100);
            product.changeName('');

        }).toThrow('Name is required');
    });

    it("should change price", () => {

        const product = new Product('Product 123', 'Product 1', 100);
        
        product.changePrice(200);

        expect(product.price).toBe(200);
    });
});