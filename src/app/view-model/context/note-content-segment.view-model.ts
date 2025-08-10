import { NoteContentEventSegment } from './note-content-event.segment';
import { NoteContentHashtagSegment } from './note-content-hashtag.segment';
import { NoteContentImageSegment } from './note-content-image.segment';
import { NoteContentLinkSegment } from './note-content-link.segment';
import { NoteContentNoteSegment } from './note-content-note.segment';
import { NoteContentNprofileSegment } from './note-content-nprofile.segment';
import { NoteContentNpubSegment } from './note-content-npub.segment';
import { NoteContentRelaySegment } from './note-content-relay.segment';
import { NoteContentSummarizedSegment } from './note-content-summarized.segment';
import { NoteContentTextSegment } from './note-content-text.segment';
import { NoteContentVideoSegment } from './note-content-video.segment';

export type NoteContentSegmentViewModel = NoteContentNoteSegment |
  NoteContentEventSegment |
  NoteContentNpubSegment |
  NoteContentNprofileSegment |
  NoteContentImageSegment |
  NoteContentVideoSegment |
  NoteContentTextSegment |
  NoteContentLinkSegment |
  NoteContentRelaySegment |
  NoteContentHashtagSegment |
  NoteContentSummarizedSegment;
