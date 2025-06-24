import { Note, NEvent, NPub, NProfile } from 'nostr-tools/nip19';
import { NoteContentSegmentType } from './note-content-segment.type';

export type NoteContentSegmentViewModel = { type: 'note', value: Note } |
  {type: 'event', value: NEvent } |
  {type: 'npub', value: NPub } |
  {type: 'nprofile', value: NProfile } |
  {type: NoteContentSegmentType, value: string };