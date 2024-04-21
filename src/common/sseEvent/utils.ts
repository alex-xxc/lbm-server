import { EventEmitter } from 'node:events';

export class sseEvent {
  private static sseEvent = new EventEmitter();

  static getEvent () {
    return this.sseEvent
  }
}