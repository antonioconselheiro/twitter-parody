 import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NostrEventKind } from '@domain/nostr-event-kind';
import { NostrUser } from '@domain/nostr-user';
import { ApiService } from '@shared/api-service/api.service';
import { NetworkErrorObservable } from '@shared/main-error/network-error.observable';
import { Event } from 'nostr-tools';
import { ITweetImgViewing } from '../tweet-img-viewing.interface';
import { ITweet } from '@domain/tweet.interface';

@Component({
  selector: 'tw-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TweetListComponent implements OnInit {

  tweets: ITweet[] = [];
//  Event<NostrEventKind.Text>[] = [];
  viewing: ITweetImgViewing | null = null;

  constructor(
    private apiService: ApiService,
    private networkError$: NetworkErrorObservable
  ) { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {
    /**
     this.apiService.get([
      {
        kinds: [NostrEventKind.Text],
        authors: [
          String(new NostrUser('npub1lafcm7zm35l9q06mnaqk5ykt2530ylnwm5j8xaykflppfstv6vysxg4ryf'))
        ]
      }
    ]).then(tweets => this.tweets = tweets)
    .catch(e => this.networkError$.next(e)); */
  }

  trackByTweetId(i: number, tweet: ITweet): string {
    return tweet.id;
  }

  onImgOpen(viewing: ITweetImgViewing | null): void {
    this.viewing = viewing;
  }
}
