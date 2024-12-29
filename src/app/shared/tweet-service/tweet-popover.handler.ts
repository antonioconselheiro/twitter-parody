import { Injectable } from '@angular/core';
import { NoteViewModel } from '@view-model/note.view-model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TweetPopoverHandler {

  readonly popover$ = new BehaviorSubject<{ note: NoteViewModel, trigger: HTMLElement } | null>(null);

  handle(agreggator: { note: NoteViewModel, trigger: HTMLElement }): void {
    this.popover$.next(agreggator);
  }

  close(): void {
    this.popover$.next(null);
  }
}
