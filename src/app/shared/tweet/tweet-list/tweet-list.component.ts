 import { Component, ViewEncapsulation } from '@angular/core';
import { NostrEventKind } from '@domain/nostr-event-kind';
import { NostrUser } from '@domain/nostr-user';
import { ApiService } from '@shared/api-service/api.service';
import { Event, SimplePool } from 'nostr-tools';

@Component({
  selector: 'tw-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
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

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.apiService.get([
      {
        kinds: [NostrEventKind.Text],
        authors: [
          String(new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'))
        ]
      }
    ]).then(tweets => this.tweets = tweets);
  }

  trackByTweetId(i: number, tweet: Event<NostrEventKind.Text>): string {
    return tweet.id;
  }
}
