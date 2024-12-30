import { Injectable } from '@angular/core';
import { NoteViewModel } from '@view-model/note.view-model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TweetContextMenuHandler {

  readonly contextMenu = new BehaviorSubject<{ note: NoteViewModel, trigger: HTMLElement } | null>(null);
  readonly shareMenu = new BehaviorSubject<{ note: NoteViewModel, trigger: HTMLElement } | null>(null);

  handleContextMenu(agreggator: { note: NoteViewModel, trigger: HTMLElement }): void {
    this.contextMenu.next(agreggator);
    this.shareMenu.next(null);
  }

  handleShareOptions(agreggator: { note: NoteViewModel, trigger: HTMLElement }): void {
    this.contextMenu.next(null);
    this.shareMenu.next(agreggator);
  }

  close(): void {
    this.contextMenu.next(null);
    this.shareMenu.next(null);
  }
}
