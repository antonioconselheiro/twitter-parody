import { RelatedContentViewModel, NoteViewModel } from "@belomonte/nostr-ngx";

export interface TweetEvent {
  tweet: RelatedContentViewModel<NoteViewModel>;
  trigger: HTMLElement;
}
