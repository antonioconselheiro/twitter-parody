 import { Component } from '@angular/core';
import { NostrEventKind } from '@domain/nostr-event-kind';
import { NostrUser } from '@domain/nostr-user';
import { Event, SimplePool } from 'nostr-tools';

@Component({
  selector: 'tw-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.scss']
})
export class TweetListComponent {
  readonly relays = [
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

  tweets: Event<NostrEventKind.Text>[] = [];

  ngOnInit(): void {
    //  TODO: este código deve ser centralizado num serviço que agrupa os eventos em tweets
    //  TODO: este código deve ser executado em um Resolve
    const pool = new SimplePool();
    let sub = pool.sub(
      this.relays,
      [
        {
          kinds: [NostrEventKind.Text],
          authors: [
            String(new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'))
          ]
        }
      ]
    );

    sub.on('event', event => {
      this.tweets.push(event);
      console.info(event);
    });

    sub.on('eose', () => {
      console.info(' :::::: EOSE :::::: ');
    });
  }

  trackByTweetId(i: number, tweet: Event<NostrEventKind.Text>): string {
    return tweet.id;
  }
}
