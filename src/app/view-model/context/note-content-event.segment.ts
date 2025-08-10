import { NEvent } from "nostr-tools/nip19";

export interface NoteContentEventSegment {
  type: 'event',
  value: NEvent
}