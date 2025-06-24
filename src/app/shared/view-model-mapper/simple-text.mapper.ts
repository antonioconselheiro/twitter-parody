import { Injectable } from '@angular/core';
import { HexString, NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { EagerNoteViewModel } from '@view-model/eager-note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { ShortTextNote } from 'nostr-tools/kinds';
import { NoteContentMapper } from './note-content.mapper';
import { SingleViewModelMapper } from './single-view-model.mapper';
import { TagHelper } from './tag.helper';

@Injectable({
  providedIn: 'root'
})
export class SimpleTextMapper implements SingleViewModelMapper<EagerNoteViewModel> {

  constructor(
    private noteContentMapper: NoteContentMapper,
    private profileProxy: ProfileProxy,
    private tagHelper: TagHelper,
    private guard: NostrGuard
  ) { }

  toViewModel(event: NostrEvent<ShortTextNote>): EagerNoteViewModel;
  toViewModel(event: NostrEvent): EagerNoteViewModel | null;
  toViewModel(event: NostrEvent): EagerNoteViewModel | null {
    if (!this.guard.isKind(event, ShortTextNote)) {
      return null;
    }

    const author = this.profileProxy.getRawAccount(event.pubkey);
    const relates: Array<HexString> = [];
    this.tagHelper.getRelatedEvents(event).forEach(([related]) => relates.push(related));

    const note: SimpleTextNoteViewModel = {
      id: event.id,
      type: 'simple',
      author,
      event,
      createdAt: event.created_at,
      content: this.noteContentMapper.toViewModel(event.content),
      //  TODO: ideally I should pass relay address from where this event come
      origin: [],
      relates
    };

    return note;
  }
}
