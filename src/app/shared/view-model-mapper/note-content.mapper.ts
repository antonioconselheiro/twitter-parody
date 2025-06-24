import { Injectable } from "@angular/core";
import { IterableString } from "@belomonte/iterable-string";
import { NoteContentViewModel } from "@view-model/context/note-content.view-model";

@Injectable()
export class NoteContentMapper {

  private readonly readNostrNote = /^nostr:note1[^\s]+\b/;
  private readonly readNostrEvent = /^nostr:event1[^\s]+\b/;
  private readonly readNostrNpub = /^nostr:npub1[^\s]+\b/;
  private readonly readNostrNprofile = /^nostr:nprofile1[^\s]+\b/;
  private readonly readSecureImage = /^https:\/\/[^\s]+\.(png|jpg|jpeg|gif|svg|webp)\b/;
  private readonly readSecureVideo = /^https:\/\/[^\s]+\.(mp4|webm|ogg|ogv)\b/;
  private readonly readSecureUrl = /^https:\/\/[^\s]+\b/;
  private readonly readRelay = /^wss:\/\/[^\s]+\b/;
  private readonly readHashtag = /^#[^\s#]+\b/;

  private readonly special = /^((nostr|wss|https):|#)/;
  private readonly readText = /^(\s?)*[^\b]+\b(\s?)*($)?/;

  private readonly regexRecord = {
    'note': this.readNostrNote,
    'event': this.readNostrEvent,
    'npub': this.readNostrNpub,
    'nprofile': this.readNostrNprofile,
    'image': this.readSecureImage,
    'video': this.readSecureVideo,
    'link': this.readSecureUrl,
    'relay': this.readRelay,
    'hashtag': this.readHashtag
  };

  toViewModel(content: string): NoteContentViewModel {
    const iterable = new IterableString(content);
    const eventContent: NoteContentViewModel = [];
    const keys = Object.keys(this.regexRecord) as Array<keyof typeof this.regexRecord>;

    do {
      for (const key of keys) {
        const regex = this.regexRecord[key];
        const segment = iterable.addCursor(regex);
        if (segment) {
          eventContent.push({ type: key, value: segment });
        }
      }

      const lastSegment = eventContent.length - 1;
      let text = '';
      if (eventContent[lastSegment]?.type === 'text') {
        text = eventContent[lastSegment].value;
      }

      do {
        text += iterable.addCursor(this.readText);
        debugger;
      } while (!iterable.spy(this.special));

      eventContent.push({ type: 'text', value: text });
      debugger;
    } while(!iterable.end());

    return eventContent;
  }
}