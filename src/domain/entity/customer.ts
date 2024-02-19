import Address from './address';

export default class Customer {

    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean =  false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        
        this._validate();
    }

    private _validate() {
        if (!this._name) {
            throw new Error('Name is required');
        }
        if (!this._id) {
            throw new Error('ID is required');
        }
    }

    changeName(name: string) {
        this._name = name;
        this._validate();
    }

    changeAddress(address: Address) {
        if (this.isActive() && !address) {
            throw new Error('Cannot remove address from an active customer');
        }
        this._address = address;
    }

    activate() {
        if (!this._address) {
            throw new Error('Address is required to activate customer');
        }
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    isActive(): boolean {
        return this._active;
    }

    addRewardPoints(points: number) {
        if (points <= 0) {
            throw new Error('Reward points must be greater than 0');
        }
        this._rewardPoints += points;
    }

    get name(): string {
        return this._name;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    get id(): string {
        return this._id;
    }

    get address(): Address {
        return this._address;
    }

}