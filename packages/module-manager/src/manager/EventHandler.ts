import EventEmitter from 'events'

export default class EventHandler {
  private emitter: EventEmitter = new EventEmitter()

  receive(event: string) {
    const [moduleId, action] = event.split(':')

    


  }
}
