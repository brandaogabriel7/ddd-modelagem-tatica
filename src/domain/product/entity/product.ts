import ProductInterface from './product.interface';

export default class Product implements ProductInterface {
  private _id: string;
  private _name: string;
  private _price: number;

  constructor(id: string, name: string, price: number) {
    this._id = id;
    this._name = name;
    this._price = price;

    this._validate();
  }

  private _validate() {
    if (!this._id) {
      throw new Error('ID is required');
    }
    if (!this._name) {
      throw new Error('Name is required');
    }
    if (this._price <= 0) {
      throw new Error('Price must be greater than 0');
    }
  }

  changeName(name: string) {
    this._name = name;
    this._validate();
  }

  get name(): string {
    return this._name;
  }

  changePrice(price: number) {
    this._price = price;
    this._validate();
  }

  get price(): number {
    return this._price;
  }

  get id(): string {
    return this._id;
  }
}
