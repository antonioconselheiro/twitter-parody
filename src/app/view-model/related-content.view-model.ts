import { Account, AccountRaw } from "@belomonte/nostr-ngx";
import { NoteReplyContext } from "./context/note-reply-context.interface";
import { NostrViewModelSet } from "./nostr-view-model.set";
import { NoteViewModel } from "./note.view-model";
import { ReactionViewModel } from "./reaction.view-model";
import { ZapViewModel } from "./zap.view-model";
import { EagerNoteViewModel } from "./eager-note.view-model";
import { LazyNoteViewModel } from "./lazy-note.view-model";

export interface RelatedContentViewModel<AccountViewModel extends Account = Account> {

  /**
   * The reposted event
   */
  reposting?: NostrViewModelSet<NoteViewModel<AccountViewModel>>;

  /**
   * Record with all reacted reactions.
   * The record index is the used char/emoji to react.
   */
  reactions: { [emoji: string]: NostrViewModelSet<ReactionViewModel<AccountViewModel>, AccountViewModel> };

  /**
   * Parsed data of each zap to this event.
   */
  zaps: NostrViewModelSet<ZapViewModel<AccountViewModel>, AccountViewModel>;

  /**
   * Set of each view model that reposted this event.
   * It is considered a repost only if it does not include additional text from the user who shared it.
   */
  reposted: NostrViewModelSet<EagerNoteViewModel<AccountViewModel>, AccountViewModel> | NostrViewModelSet<LazyNoteViewModel, AccountRaw>;

  /**
   * Set of each view model that mentioned this event.
   * It is considered a mention if it include an additional commentary from the user who shared it.
   */
  mentioned: NostrViewModelSet<EagerNoteViewModel<AccountViewModel>, AccountViewModel> | NostrViewModelSet<LazyNoteViewModel, AccountRaw>;

  /**
   * Data about repling and be replied.
   */
  reply: NoteReplyContext<AccountViewModel>;
}
