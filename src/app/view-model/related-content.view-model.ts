import { NoteReplyContext } from "./context/note-reply-context.interface";
import { NostrViewModelSet } from "./nostr-view-model.set";
import { NoteViewModel } from "./note.view-model";
import { ReactionViewModel } from "./reaction.view-model";
import { ZapViewModel } from "./zap.view-model";

export interface RelatedContentViewModel {

  /**
   * The reposted event
   */
  reposting?: NostrViewModelSet<NoteViewModel>;

  /**
   * Record with all reacted reactions.
   * The record index is the used char/emoji to react.
   */
  reactions: { [emoji: string]: NostrViewModelSet<ReactionViewModel> };

  /**
   * Parsed data of each zap to this event.
   */
  zaps: NostrViewModelSet<ZapViewModel>;

  /**
   * Set of each view model that reposted this event.
   * It is considered a repost only if it does not include additional text from the user who shared it.
   */
  reposted: NostrViewModelSet<NoteViewModel>;

  /**
   * Set of each view model that mentioned this event.
   * It is considered a mention if it include an additional commentary from the user who shared it.
   */
  mentioned: NostrViewModelSet<NoteViewModel>;

  /**
   * Data about repling and be replied.
   */
  reply: NoteReplyContext;
}
