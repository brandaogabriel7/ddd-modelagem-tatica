import Product from '../entity/product';
import ProductB from '../entity/product-b';
import ProductInterface from '../entity/product.interface';
import { v4 as uuid } from 'uuid';

const PRODUCT_FACTORY_FUNCTIONS: {
  [key: string]: (name: string, price: number) => ProductInterface;
} = {
  a: (name: string, price: number) => new Product(uuid(), name, price),
  b: (name: string, price: number) => new ProductB(uuid(), name, price),
};

export default class ProductFactory {
  public static create(
    type: string,
    name: string,
    price: number,
  ): ProductInterface {
    if (PRODUCT_FACTORY_FUNCTIONS[type]) {
      return PRODUCT_FACTORY_FUNCTIONS[type](name, price);
    }
    throw new Error('Invalid product type');
  }
}
