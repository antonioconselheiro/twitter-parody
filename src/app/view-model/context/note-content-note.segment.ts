import { Note } from 'nostr-tools/nip19';

export interface NoteContentNoteSegment {
  type: 'note';
  value: Note;
}