import { NProfile } from 'nostr-tools/nip19';

export interface NoteContentNprofileSegment {
  type: 'nprofile';
  value: NProfile;
}