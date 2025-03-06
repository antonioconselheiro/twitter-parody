import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Account, CurrentAccountObservable } from '@belomonte/nostr-ngx';
import { TweetContextMenuHandler } from '@shared/tweet-service/tweet-popover.handler';
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

  profile: Account | null = null;

  constructor(
    private profile$: CurrentAccountObservable,
    private tweetPopoverHandler: TweetContextMenuHandler
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

  openTweetShareOptions(note: NoteViewModel, trigger: HTMLElement): void {
    this.tweetPopoverHandler.handleShareOptions({ note, trigger });
  }

  isRetweetedByYou(note: NoteViewModel): boolean {
    if ('isSimpleRepost' in note && note.isSimpleRepost) {
      return !![...note.reposted].find(reposted => reposted.author.pubkey === this.profile?.pubkey);
    }

    return note.author.pubkey === this.profile?.pubkey;
  }

  isLikedByYou(tweet: NoteViewModel): boolean {
    const flatArraySize = 2;
    let reactions = Object
      .values(tweet.reactions);

    if (tweet.reposted) {
      reactions = Object
        .values([...tweet.reposted || []][0]?.reactions || {});
    }

    return !!reactions
      .map(reactions => [...reactions])
      .flat(flatArraySize)
      .find(reaction => reaction.author.pubkey === this.profile?.pubkey);
  }

  getRetweetedLength(tweet: NoteViewModel): number {
    return tweet.reposted?.size || 0;
  }

  getTweetReactionsLength(tweet?: NoteViewModel | null): number {
    return Object
      .values(tweet?.reactions || {})
      .map(set => set.size)
      .reduce((acc, curr) => acc + curr, 0);
  }
}
