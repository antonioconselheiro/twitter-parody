import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ModalBuilder } from '@belomonte/async-modal-ngx';
import { Account, CurrentProfileObservable } from '@belomonte/nostr-ngx';
import { SubscribeToContinueComponent } from '@shared/modal/subscribe-to-continue/subscribe-to-continue.component';
import { SubscribeToContinueEntryType } from '@shared/modal/subscribe-to-continue/subscribe-to-continue.entry-type';
import { TweetContextMenuHandler } from '@shared/tweet-service/tweet-popover.handler';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';
import { Observable, Subscription } from 'rxjs';

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
    this.listenProfileSubscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private listenProfileSubscription(): void {
    this.subscriptions.add(this.profile$.subscribe({
      next: profile => this.profile = profile
    }));
  }

  onClickReply(note: RelatedContentViewModel<NoteViewModel>): void {
    if (this.profile) {

    } else {
      this.showLoginModal({
        message: 'Login with a Nostr account to reply',
        icon: 'reply'
      });
    }
  }

  onClickRetweet(note: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement): void {
    if (this.profile) {
      this.tweetPopoverHandler.handleRetweetContextMenu({ note, trigger });
    } else {
      this.showLoginModal({
        message: 'Login with a nostr account to retweet',
        icon: 'share'
      });
    }
  }

  onClickReact(note: RelatedContentViewModel<NoteViewModel>): void {
    if (this.profile) {

    } else {
      this.showLoginModal({
        message: 'Login with a nostr account to react',
        icon: 'react'
      });
    }
  }

  private showLoginModal(params: SubscribeToContinueEntryType): Observable<void> {
    return new ModalBuilder(SubscribeToContinueComponent)
      .setData(params)
      .build();
  }

  onClickShareOptions(note: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement): void {
    this.tweetPopoverHandler.handleShareContextMenu({ note, trigger });
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
