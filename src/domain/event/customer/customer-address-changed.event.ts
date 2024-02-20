import Customer from '../../entity/customer';
import EventInterface from '../@shared/event.interface';

export default class CustomerAddressChangedEvent implements EventInterface<Customer> {
    dateTimeOccured: Date;
    eventData: Customer;

    constructor(eventData: Customer) {
        this.dateTimeOccured = new Date();
        this.eventData = eventData;
    }

}