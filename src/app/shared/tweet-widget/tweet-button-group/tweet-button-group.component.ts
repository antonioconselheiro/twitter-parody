import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Account, CurrentAccountObservable } from '@belomonte/nostr-ngx';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { NoteViewModel } from '@view-model/note.view-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-tweet-button-group',
  templateUrl: './tweet-button-group.component.html',
  styleUrls: ['./tweet-button-group.component.scss']
})
export class TweetButtonGroupComponent implements OnInit, OnDestroy {

  subscriptions = new Subscription();

  @Input()
  tweet: NoteViewModel | null = null;

  @ViewChild('tweetShare', { read: PopoverComponent })
  share!: PopoverComponent;

  profile: Account | null = null;

  constructor(
    private profile$: CurrentAccountObservable
  ) { }

  ngOnInit(): void {
    this.bindProfileSubscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private bindProfileSubscription(): void {
    this.subscriptions.add(this.profile$.subscribe({
      next: profile => this.profile = profile
    }));
  }

  isRetweetedByYou(tweet: NoteViewModel): boolean {
    if ('isSimpleRepost' in tweet && tweet.isSimpleRepost) {
      return !!tweet.reposted.find(note => note.pubkey === this.profile?.pubkey);
    }

    return tweet.author.pubkey === this.profile?.pubkey;
  }

  isLikedByYou(tweet: NoteViewModel): boolean {
    const flatArraySize = 2;
    let reactions = Object
      .values(tweet.reactions);

    if ('isSimpleRepost' in tweet && tweet.isSimpleRepost) {
      reactions = Object
        .values(tweet.reposting[0].reactions);
    }

    return !!reactions
      .map(reactions => [...reactions])
      .flat(flatArraySize)
      .find(reaction => reaction.author.pubkey === this.profile?.pubkey);
  }

  getRetweetedLength(tweet: NoteViewModel): number {
    return tweet.reposting?.length || 0;
  }

  getTweetReactionsLength(tweet?: NoteViewModel | null): number {
    return Object
      .values(tweet?.reactions || {})
      .map(set => set.size)
      .reduce((acc, curr) => acc + curr, 0);
  }
}
