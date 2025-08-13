import { Injectable } from '@angular/core';
import { HexString, NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { EagerNoteViewModel } from '@view-model/eager-note.view-model';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { ShortTextNote } from 'nostr-tools/kinds';
import { NoteContentMapper } from './note-content.mapper';
import { SingleViewModelMapper } from './single-view-model.mapper';
import { TagHelper } from './tag.helper';
import { RelayDomain } from '@view-model/relay-domain.type';
import { nip19 } from 'nostr-tools';

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

  toViewModel(event: NostrEvent<ShortTextNote>, origin: Array<RelayDomain>): EagerNoteViewModel;
  toViewModel(event: NostrEvent, origin: Array<RelayDomain>): EagerNoteViewModel | null;
  toViewModel(event: NostrEvent, origin: Array<RelayDomain>): EagerNoteViewModel | null {
    if (!this.guard.isKind(event, ShortTextNote)) {
      return null;
    }

    const author = this.profileProxy.getRawAccount(event.pubkey);
    const relates: Array<HexString> = [];
    this.tagHelper.getRelatedEvents(event).forEach(([related]) => relates.push(related));
    const content = this.noteContentMapper.toViewModel(event.content);
    const media = content
      .filter(segment => segment.type === 'image' || segment.type === 'video');

    const note = nip19.noteEncode(event.id);
    const nevent = nip19.neventEncode({
      id: event.id,
      author: event.pubkey,
      kind: event.kind,
      relays: origin
    });

    const simpleText: SimpleTextNoteViewModel = {
      id: event.id,
      note,
      nevent,
      type: 'simple',
      author,
      event,
      createdAt: event.created_at,
      content,
      media,
      origin,
      relates
    };

    return simpleText;
  }
}
