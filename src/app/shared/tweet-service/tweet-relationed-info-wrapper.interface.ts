import { TNostrPublic } from "@belomonte/nostr-ngx";
import { DataLoadType } from "@domain/data-load.type";
import { ITweet } from "@domain/tweet.interface";

export interface ITweetRelationedInfoWrapper {
  eager: Array<ITweet<DataLoadType.EAGER_LOADED>>;
  lazy: Array<ITweet<DataLoadType.LAZY_LOADED>>;
  npubs: Array<TNostrPublic>
}