import EventDispatcherInterface from './event-dispatcher.interface';
import EventHandlerInterface from './event-handler.interface';
import EventInterface from './event.interface';

export default class EventDispatcher implements EventDispatcherInterface {
  private _eventHandlers: { [eventName: string]: EventHandlerInterface[] } = {};

  get getEventHandlers(): { [eventName: string]: EventHandlerInterface[] } {
    return this._eventHandlers;
  }

  register(
    eventName: string,
    eventHandler: EventHandlerInterface<EventInterface>,
  ): void {
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = [];
    }
    this._eventHandlers[eventName].push(eventHandler);
  }

  unregister(
    eventName: string,
    eventHandler: EventHandlerInterface<EventInterface>,
  ): void {
    this._eventHandlers[eventName] = this._eventHandlers[eventName].filter(
      (handler) => handler !== eventHandler,
    );
  }

  unregisterAll(): void {
    this._eventHandlers = {};
  }

  notify(event: EventInterface): void {
    const eventName = event.constructor.name;
    if (this._eventHandlers[eventName]) {
      for (const eventHandler of this._eventHandlers[eventName]) {
        eventHandler.handle(event);
      }
    }
  }
}
