import { Injectable } from "@angular/core";
import { IterableString } from "@belomonte/iterable-string";
import { NoteContentViewModel } from "@view-model/context/note-content.view-model";

@Injectable()
export class NoteContentMapper {

  private readonly dontAutoTrim = false;

  private readonly readNostrNote = /^nostr:note1\S+/;
  private readonly readNostrEvent = /^nostr:event1\S+/;
  private readonly readNostrNpub = /^nostr:npub1\S+/;
  private readonly readNostrNprofile = /^nostr:nprofile1\S+/;
  private readonly readSecureImage = /^https:\/\/\S+\.(png|jpg|jpeg|gif|svg|webp)\b/;
  private readonly readSecureVideo = /^https:\/\/\S+\.(mp4|webm|ogg|ogv)\b/;
  private readonly readSecureUrl = /^https:\/\/\S+/;
  private readonly readRelay = /^wss:\/\/\S+/;
  private readonly readHashtag = /^#[^\s#]+/;
  private readonly readWhitespace = /^\s*/;

  private readonly special = /^((nostr|wss|https):|#|$)/;
  private readonly readText = /^\s*\S+\s*/;

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

  // eslint-disable-next-line complexity
  toViewModel(content: string): NoteContentViewModel {
    const iterable = new IterableString(content);
    const eventContent: NoteContentViewModel = [];
    const keys = Object.keys(this.regexRecord) as Array<keyof typeof this.regexRecord>;
    let mediaPosition = 0;

    do {
      let loopFilled = false;
      for (const key of keys) {
        const regex = this.regexRecord[key];
        const segment = iterable.addCursor(regex);
        if (segment) {
          if (key === 'video' || key === 'image') {
            eventContent.push({ type: key, value: segment, position: mediaPosition++ });
          } else {
            //  FIXME: o segment foi validado o formato via regex, entretanto a tipagem não reconheceu isso
            //  preciso imaginar uma forma criativa de resolver esta questão de tipagem
            eventContent.push({ type: key, value: segment as any });
          }
          loopFilled = true;

          const whitespace = iterable.addCursor(this.readWhitespace, this.dontAutoTrim);
          if (whitespace.length) {
            eventContent.push({ type: 'text', value: whitespace });
          }

          break;
        }
      }

      if (loopFilled) {
        continue;
      }

      const lastSegment = eventContent.length - 1;
      let text = '';
      if (eventContent[lastSegment]?.type === 'text') {
        text = eventContent[lastSegment].value;
        eventContent.pop();
      }

      do {
        text += iterable.addCursor(this.readText, this.dontAutoTrim);
      } while (!iterable.spy(this.special));

      eventContent.push({ type: 'text', value: text });
    } while(!iterable.end());

    return eventContent;
  }
}