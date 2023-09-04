import { Injectable } from '@angular/core';
import { Event, Filter, SimplePool } from 'nostr-tools';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly relays = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.snort.social',
    'wss://nostr.orangepill.dev',
    'wss://nostr-pub.wellorder.net',
    'wss://offchain.pub',
    'wss://relay.shitforce.one',
    'wss://yabu.me',
    'wss://relayable.org',
    'wss://ca.relayable.org',
    'wss://nostr.vulpem.com',
    'wss://nostrich.friendship.tw',
    'wss://n.xmr.se',
    'wss://nostr-1.nbo.angani.co',
    'wss://eden.nostr.land',
    'wss://feeds.nostr.band',
    'wss://nostr.wine',
    'wss://e.nos.lol',
    'wss://nostrue.com',
    'wss://nostr.oxtr.dev',
    'wss://relar.nostr.bg',
    'wss://really.nostr.br',
    'wss://nostr.mom',
    'wss://nostr.fmt.wiz.biz',
    'wss://relay.orangepill.dev',
    'wss://relay.nostrati.com',
    'wss://relay.nostr.com.au',
    'wss://nostr.milou.lol'
  ];

  get(filters: Filter[]): Promise<Array<Event<number>>> {
    const pool = new SimplePool();
    const events = new Array<Event<number>>();
    let sub = pool.sub(
      this.relays, filters
    );

    sub.on('event', event => { events.push(event); });
    sub.on('count', count => console.info('count event >> ', count))
    
    return new Promise(resolve => {
      sub.on('eose', () => {
        resolve(events);
        sub.unsub();
      });
    });
  }
}
