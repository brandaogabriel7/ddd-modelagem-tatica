import ProductInterface from './product.interface';

export default class ProductB implements ProductInterface {

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

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get price(): number {
        return 2 * this._price;
    }

}