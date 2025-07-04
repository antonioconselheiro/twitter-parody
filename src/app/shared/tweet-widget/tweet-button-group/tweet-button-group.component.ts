import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalBuilder } from '@belomonte/async-modal-ngx';
import { Account, CurrentProfileObservable } from '@belomonte/nostr-ngx';
import { SubscribeToContinueComponent } from '@shared/modal/subscribe-to-continue/subscribe-to-continue.component';
import { TweetContextMenuHandler } from '@shared/tweet-service/tweet-popover.handler';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-tweet-button-group',
  templateUrl: './tweet-button-group.component.html',
  styleUrls: ['./tweet-button-group.component.scss']
})
export class TweetButtonGroupComponent implements OnInit, OnDestroy {
  
  @Input()
  tweet: RelatedContentViewModel<NoteViewModel> | null = null;
  
  profile: Account | null = null;
  
  subscriptions = new Subscription();

  constructor(
    private profile$: CurrentProfileObservable,
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

  onClickReply(note: RelatedContentViewModel<NoteViewModel>): void {
    new ModalBuilder(SubscribeToContinueComponent)
      .setData({
        message: 'Login with a Nostr account to reply',
        icon: 'reply'
      })
      .build();
  }

  onClickRetweet(note: RelatedContentViewModel<NoteViewModel>): void {
    new ModalBuilder(SubscribeToContinueComponent)
      .setData({
        message: 'Login with a Nostr account to retweet',
        icon: 'share'
      })
      .build();
  }

  onClickReact(note: RelatedContentViewModel<NoteViewModel>): void {
    new ModalBuilder(SubscribeToContinueComponent)
      .setData({
        message: 'Login with a Nostr account to react',
        icon: 'react'
      })
      .build();
  }

  onClickShareOptions(note: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement): void {
    this.tweetPopoverHandler.handleShareOptions({ note, trigger });
  }

  isRetweetedByYou(relatedContent: RelatedContentViewModel<NoteViewModel>): boolean {
    if (relatedContent.viewModel.type === 'repost' && this.profile) {
      relatedContent.repostedAuthors.indexOf(this.profile.pubkey)

      return !![...relatedContent.repostedAuthors].find(reposterPubkey => {
        if (reposterPubkey && this.profile) {
          return reposterPubkey === this.profile.pubkey;
        }

        return false;
      });
    }

    if (relatedContent.viewModel.author && this.profile) {
      return relatedContent.viewModel.author.pubkey === this.profile.pubkey;
    }

    return false;
  }

  isLikedByYou(tweet: RelatedContentViewModel<NoteViewModel>): boolean {
    const profile = this.profile;
    if (profile) {
      const find = tweet.reactionsAuthors.find(author => author === profile.pubkey);
      return !!find;
    }

    return false;
  }

  getRetweetedLength(tweet: RelatedContentViewModel<NoteViewModel>): number {
    return tweet.reposted?.size || 0;
  }

  getTweetReactionsLength(tweet?: RelatedContentViewModel<NoteViewModel> | null): number {
    return Object
      .values(tweet?.reactions || {})
      .map(set => set.size)
      .reduce((acc, curr) => acc + curr, 0);
  }
}
