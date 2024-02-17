import { Sequelize } from 'sequelize-typescript';
import ProductModel from '../db/sequelize/model/product.model';
import Product from '../../domain/entity/product';
import ProductRepository from './product.repository';
import { createSequelizeTestInstance } from '../test-utils/sequelize-test-utils';

describe("Product Repository test", () => {
    let sequelize: Sequelize;
    let productRepository: ProductRepository;

    beforeEach(async () => {
        sequelize = createSequelizeTestInstance();

        await sequelize.sync();
        productRepository = new ProductRepository();
    });
    
    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {
        const product = new Product('1', 'Product 1', 100);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: product.id } });

        expect(productModel.toJSON()).toStrictEqual({
            id: '1',
            name: 'Product 1',
            price: 100
        });
    });

    it("should update a product", async () => {
        const product = new Product('1', 'Product 1', 100);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: product.id } });

        expect(productModel.toJSON()).toStrictEqual({
            id: '1',
            name: 'Product 1',
            price: 100
        });

        product.changeName('Product 2');
        product.changePrice(200);

        await productRepository.update(product);

        const updatedProductModel = await ProductModel.findOne({ where: { id: product.id } });

        expect(updatedProductModel.toJSON()).toStrictEqual({
            id: '1',
            name: 'Product 2',
            price: 200
        });
    });

    it("should find a product", async () => {
        const product = new Product('1', 'Product 1', 100);

        await productRepository.create(product);

        const productModel = await ProductModel.findOne({ where: { id: product.id } });

        const foundProduct = await productRepository.find(product.id);

        expect(productModel.toJSON()).toStrictEqual({
            id: foundProduct.id,
            name: foundProduct.name,
            price: foundProduct.price
        });        
    });

    it("should find all products", async () => {
        const product1 = new Product('1', 'Product 1', 100);
        await productRepository.create(product1);

        const product2 = new Product('2', 'Product 2', 200);
        await productRepository.create(product2);

        const foundProducts = await productRepository.findAll();
        const products = [product1, product2];

        expect(foundProducts).toStrictEqual(products);
    });

    it("should throw an error when trying to find a non-existing product", async () => {
        await expect(productRepository.find('1')).rejects.toThrow('Product not found');
    });

});