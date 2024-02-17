export default class Address {
    private _street: string;
    private _number: number;
    private _zipCode: string;
    private _city: string;
    private _state: string;

    constructor(street: string, number: number, zipCode: string, city: string, state: string) {
        this._street = street;
        this._number = number;
        this._zipCode = zipCode;
        this._city = city;
        this._state = state;

        this.validate();
    }

    validate() {
        if (!this._street) {
            throw new Error('Street is required');
        }
        if (!this._city) {
            throw new Error('City is required');
        }
        if (!this._state) {
            throw new Error('State is required');
        }
        if (!this._zipCode) {
            throw new Error('Zip code is required');
        }
        if (this._number <= 0) {
            throw new Error('Number must be greater than 0');
        }
    }

    toString(): string {
        return `${this._street}, ${this._number}, ${this._city}, ${this._state}, ${this._zipCode}`;
    }

    get street(): string {
        return this._street;
    }

    get number(): number {
        return this._number;
    }

    get zipCode(): string {
        return this._zipCode;
    }

    get city(): string {
        return this._city;
    }

    get state(): string {
        return this._state;
    }
}