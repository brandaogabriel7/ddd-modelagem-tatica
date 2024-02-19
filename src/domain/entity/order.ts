import OrderItem from "./order-item";

export default class Order {

    private _id: string;
    private _customerId: string;
    private _items: OrderItem[] = [];

    constructor(id: string, customerId: string, items: OrderItem[] = []) {
        this._id = id;
        this._customerId = customerId;
        this._items = items;

        this._validate();
    }

    private _validate() {
        if (!this._id) {
            throw new Error('ID is required');
        }
        if (!this._customerId) {
            throw new Error('Customer ID is required');
        }
        if (this._items.length === 0) {
            throw new Error('Order must have at least one item');
        }
    }

    get id(): string {
        return this._id;
    }

    get customerId(): string { 
        return this._customerId;
    }

    get items(): OrderItem[] {
        return this._items;
    }

    updateItems(items: OrderItem[]) {
        this._items = items;
        this._validate();
    }

    total(): number {
        return this._items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }
}