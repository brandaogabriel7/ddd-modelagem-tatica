export default interface EventInterface<T = any> {
  dateTimeOccured: Date;
  eventData: T;
}
