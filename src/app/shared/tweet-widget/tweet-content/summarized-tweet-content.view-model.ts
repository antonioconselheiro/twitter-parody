import { NoteContentViewModel } from "@view-model/context/note-content.view-model";
import { NoteViewModel } from "@view-model/note.view-model";
import { RelatedContentViewModel } from "@view-model/related-content.view-model";

export interface SummarizedTweetContentViewModel {
  showSummarized: boolean;
  videoUrl: string | null;
  images: [string, string?][];
  summarized: NoteContentViewModel;
  note: RelatedContentViewModel<NoteViewModel>;
}
