import { Injectable } from '@angular/core';
import { NoteViewModel } from '@view-model/note.view-model';
import { RelatedContentViewModel } from '@view-model/related-content.view-model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TweetContextMenuHandler {

  readonly optionsMenu = new BehaviorSubject<{ note: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement } | null>(null);
  readonly retweetMenu = new BehaviorSubject<{ note: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement } | null>(null);
  readonly shareMenu = new BehaviorSubject<{ note: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement } | null>(null);

  handleOptionsContextMenu(agreggator: { note: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement }): void {
    this.optionsMenu.next(agreggator);
    this.shareMenu.next(null);
    this.retweetMenu.next(null);
  }

  handleRetweetContextMenu(agreggator: { note: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement }): void {
    this.optionsMenu.next(null);
    this.shareMenu.next(null);
    this.retweetMenu.next(agreggator);
  }

  handleShareContextMenu(agreggator: { note: RelatedContentViewModel<NoteViewModel>, trigger: HTMLElement }): void {
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
