import { Inject, Injectable } from '@angular/core';
import { HexString, NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { HTML_PARSER_TOKEN } from '@shared/htmlfier/html-parser.token';
import { NoteHtmlfier } from '@shared/htmlfier/note-htmlfier.interface';
import { EagerNoteViewModel } from '@view-model/eager-note.view-model';
import { LazyNoteViewModel } from '@view-model/lazy-note.view-model';
import { NostrViewModelSet } from '@view-model/nostr-view-model.set';
import { SimpleTextNoteViewModel } from '@view-model/simple-text-note.view-model';
import { ShortTextNote } from 'nostr-tools/kinds';
import { SingleViewModelMapper } from './single-view-model.mapper';
import { TagHelper } from './tag.helper';

@Injectable({
  providedIn: 'root'
})
export class SimpleTextMapper implements SingleViewModelMapper<EagerNoteViewModel> {

  constructor(
    @Inject(HTML_PARSER_TOKEN) private htmlfier: NoteHtmlfier,
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
      author,
      event,
      createdAt: event.created_at,
      content: this.htmlfier.parse(event.content),
      media: this.htmlfier.extractMedia(event.content),
      //  TODO: ideally I should pass relay address from where this event come
      origin: [],
      reposted: new NostrViewModelSet<LazyNoteViewModel>(),
      mentioned: new NostrViewModelSet<LazyNoteViewModel>(),
      relates
    };

    return note;
  }
}
