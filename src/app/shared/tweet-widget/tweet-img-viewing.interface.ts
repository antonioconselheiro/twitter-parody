import { RelatedContentViewModel, NoteViewModel } from "@belomonte/nostr-ngx";

export interface TweetImageViewing {
  tweet: RelatedContentViewModel<NoteViewModel>;
  media: number;
}
