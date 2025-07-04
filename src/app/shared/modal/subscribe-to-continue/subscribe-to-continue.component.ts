import { Component } from '@angular/core';
import { ModalableDirective } from '@belomonte/async-modal-ngx';
import { Subject } from 'rxjs';
import { ContinuableActionType } from './continuable-action.type';
import { SubscribeToContinueEntryType } from './subscribe-to-continue.entry-type';

@Component({
  selector: 'tw-subscribe-to-continue',
  templateUrl: './subscribe-to-continue.component.html',
  styleUrl: './subscribe-to-continue.component.scss'
})
export class SubscribeToContinueComponent extends ModalableDirective<SubscribeToContinueEntryType, void> {

  readonly defaultTitle = 'Enter to continue';
  readonly defaultMessage = 'Login with a Nostr account to continue';

  response = new Subject<void>();
  
  title = this.defaultTitle;
  message = this.defaultMessage;
  icon: ContinuableActionType | null = null;

  readonly iconsRecord: { [action in ContinuableActionType & '']: string } = {
    react: 'readTweet/likeActive',
    reply: 'readTweet/replyActive',
    share: 'readTweet/retweetActive'
  };

  override onInjectData(data: SubscribeToContinueEntryType | null): void {
    if (data) {
      if (data.message) {
        this.message = data.message;
      }

      if (data.title) {
        this.title = data.title;
      }

      if (data.icon) {
        this.icon = data.icon;
      }
    }
  }
}
