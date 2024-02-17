import { Sequelize } from 'sequelize-typescript';
import Product from '../../domain/entity/product';
import ProductRepositoryInterface from '../../domain/repository/product-repository.interface';
import ProductModel from '../db/sequelize/model/product.model';

export default class ProductRepository implements ProductRepositoryInterface {

    private _productModel: typeof ProductModel;

    constructor(sequelize: Sequelize) {
        this._productModel = sequelize.models.ProductModel as typeof ProductModel;
    }
    
    async create(entity: Product): Promise<void> {

        await this._productModel.create({
            id: entity.id,
            name: entity.name,
            price: entity.price
        });
    }
    
    async update(entity: Product): Promise<void> {
        
        await this._productModel.update({
            name: entity.name,
            price: entity.price
        },
        {
            where: { id: entity.id }
        });
    }
    
    async find(id: string): Promise<Product> {
        const productModel = await this._productModel.findOne({ where: { id } });
        
        if (!productModel) {
            throw new Error('Product not found');
        }

        return new Product(
            productModel.id,
            productModel.name,
            productModel.price
        );
    }
    
    async findAll(): Promise<Product[]> {
        const productModels = await this._productModel.findAll();
        
        return productModels.map(productModel => new Product(
            productModel.id,
            productModel.name,
            productModel.price
        ));
    }
}