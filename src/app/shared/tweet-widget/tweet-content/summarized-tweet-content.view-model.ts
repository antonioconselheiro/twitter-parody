import { NoteContentViewModel, RelatedContentViewModel, NoteViewModel } from "@belomonte/nostr-ngx";
import { TweetMediaContentViewModel } from "./tweet-media-content.view-model";

export interface SummarizedTweetContentViewModel {
  showSummarized: boolean;
  videoUrl: string | null;
  images: [TweetMediaContentViewModel, TweetMediaContentViewModel?][];
  summarized: NoteContentViewModel;
  note: RelatedContentViewModel<NoteViewModel>;
}
