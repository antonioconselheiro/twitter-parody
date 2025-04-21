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
   * Parsed data of each zap to this event.
   */
  zaps: Set<HexString>;

  /**
   * Set of each view model that reposted this event.
   * It is considered a repost only if it does not include additional text from the user who shared it.
   */
  reposted: Set<HexString>;

  /**
   * Set of each view model that mentioned this event.
   * It is considered a mention if it include an additional commentary from the user who shared it.
   */
  mentioned: Set<HexString>;

  /**
   * Data about repling and be replied.
   */
  reply: HexString;

  /**
   * View model where the relationships refer to 
   */
  viewModel: GenericViewModel;

}
