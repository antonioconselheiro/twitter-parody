import { Component, Input } from '@angular/core';
import { Account, FeedViewModel, HexString, NoteViewModel, ProfileProxy, RelatedContentViewModel } from '@belomonte/nostr-ngx';
import { TweetContextMenuHandler } from '@shared/tweet-service/tweet-popover.handler';
import { TweetImageViewing } from '../tweet-img-viewing.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'tw-tweet-list',
  templateUrl: './tweet-list.component.html',
  styleUrls: ['./tweet-list.component.scss']
})
export class TweetListComponent {

  @Input()
  root: RelatedContentViewModel<NoteViewModel> | null = null;

  @Input()
  feed: FeedViewModel | null = null;

  @Input()
  loading = true;

  viewing: TweetImageViewing | null = null;
  activeViewingImage = 0;
  private readonly indexNotFound = -1;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private profileProxy: ProfileProxy,
    private tweetPopoverHandler: TweetContextMenuHandler
  ) {}

  trackByTweetId(i: number, related: RelatedContentViewModel<NoteViewModel>): string {
    return related.viewModel.id;
  }

  openTweetContextMenu(tweet: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement): void {
    this.tweetPopoverHandler.handleOptionsContextMenu({ tweet, trigger });
  }

  getAccount(pubkey: HexString | undefined): Account | null {
    if (!pubkey) {
      return null;
    }

    return this.profileProxy.getAccount(pubkey);
  }

  async onImageOpen(viewing: TweetImageViewing | null): Promise<void> {
    if (viewing) {
      let segments = this.activatedRoute.snapshot.url.map(segment => segment.path);
      const mediaIndex = segments.indexOf('media');
      if (mediaIndex !== this.indexNotFound) {
        segments = segments.splice(0, mediaIndex - 1);
      }

      await this.router.navigate([ ...segments, viewing.tweet.viewModel.id, 'media', viewing.media ], {
        relativeTo: this.activatedRoute.root,
        replaceUrl: true
      });
    }
  }
}
