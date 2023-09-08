import { Injectable } from '@angular/core';
import { Event, Filter, SimplePool } from 'nostr-tools';
import { defaultRelays } from '../../default-relays';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly relays = defaultRelays;

  get<K extends number>(filters: Filter<K>[]): Promise<Array<Event<K>>> {
    const pool = new SimplePool();
    const events = new Array<Event<K>>();
    const sub = pool.sub(
      this.relays, filters
    );

    sub.on('event', event => { events.push(event); });
    sub.on('count', count => console.info('count event >> ', count))
    
    return new Promise(resolve => {
      sub.on('eose', () => {
        resolve(events);
        //  sub.unsub(); FIXME: should unsubscribe each interaction?
      });
    });
  }
}
