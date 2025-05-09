import { HexString } from '@belomonte/nostr-ngx';
import { NostrEventIdViewModel } from './nostr-event-id.view-model';
import { NostrEventViewModel } from './nostr-event.view-model';

export interface RelatedContentViewModel<GenericViewModel extends NostrEventIdViewModel | NostrEventViewModel> {

  /**
   * The reposted event
   */
  reposting?: Set<HexString>;

  /**
   * Record with all reacted reactions.
   * The record index is the used char/emoji to react.
   */
  reactions: { [emoji: string]: Set<HexString> };

  /**
   * Authors who reacted to this note
   */
  reactionsAuthors: Array<HexString>;

  /**
   * Parsed data of each zap to this event.
   */
  zaps: Set<HexString>;

  /**
   * Authors of zaps to this note
   */
  zapAuthors: Array<HexString>;

  /**
   * Set of each view model that reposted this event.
   * It is considered a repost only if it does not include additional text from the user who shared it.
   */
  reposted: Set<HexString>;

  /**
   * Authors of reposts of this note 
   */
  repostedAuthors: Array<HexString>;

  /**
   * Set of each view model that mentioned this event.
   * It is considered a mention if it include an additional commentary from the user who shared it.
   */
  mentioned: Set<HexString>;

  /**
   * Authors of mentions to this note 
   */
  mentionedAuthors: Array<HexString>;

  /**
   * List of ids of replies to this event
   */
  repliedBy: Set<HexString>;

  /**
   * Authors of replies to this note 
   */
  repliedByAuthors: Array<HexString>;

  /**
   * View model where the relationships refer to 
   */
  viewModel: GenericViewModel;

}
