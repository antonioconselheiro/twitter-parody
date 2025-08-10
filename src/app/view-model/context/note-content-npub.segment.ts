import { NPub } from 'nostr-tools/nip19';

export interface NoteContentNpubSegment {
  type: 'npub';
  value: NPub;
}
