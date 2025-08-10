import { NoteContentViewModel } from "@view-model/context/note-content.view-model";
import { NoteViewModel } from "@view-model/note.view-model";
import { RelatedContentViewModel } from "@view-model/related-content.view-model";
import { TweetMediaContentViewModel } from "./tweet-media-content.view-model";

export interface SummarizedTweetContentViewModel {
  showSummarized: boolean;
  videoUrl: string | null;
  images: [TweetMediaContentViewModel, TweetMediaContentViewModel?][];
  summarized: NoteContentViewModel;
  note: RelatedContentViewModel<NoteViewModel>;
}
