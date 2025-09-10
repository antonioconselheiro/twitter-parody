import { Injectable } from '@angular/core';
import { RelatedContentViewModel, NoteViewModel } from '@belomonte/nostr-ngx';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TweetContextMenuHandler {

  readonly optionsMenu = new BehaviorSubject<{ tweet: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement } | null>(null);
  readonly retweetMenu = new BehaviorSubject<{ tweet: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement } | null>(null);
  readonly shareMenu = new BehaviorSubject<{ tweet: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement } | null>(null);

  handleOptionsContextMenu(agreggator: { tweet: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement }): void {
    this.optionsMenu.next(agreggator);
    this.shareMenu.next(null);
    this.retweetMenu.next(null);
  }

  handleRetweetContextMenu(agreggator: { tweet: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement }): void {
    this.optionsMenu.next(null);
    this.shareMenu.next(null);
    this.retweetMenu.next(agreggator);
  }

  handleShareContextMenu(agreggator: { tweet: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement }): void {
    this.optionsMenu.next(null);
    this.shareMenu.next(agreggator);
    this.retweetMenu.next(null);
  }

  close(): void {
    this.optionsMenu.next(null);
    this.shareMenu.next(null);
    this.retweetMenu.next(null);
  }
}
