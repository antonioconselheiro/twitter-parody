import { DataLoadType } from "@domain/data-load.type";
import { TNostrPublic } from "@domain/nostr-public.type";
import { ITweet } from "@domain/tweet.interface";

export interface ITweetRelatedInfoWrapper {
  eager: Array<ITweet<DataLoadType.EAGER_LOADED>>;
  lazy: Array<ITweet<DataLoadType.LAZY_LOADED>>;
  npubs: Array<TNostrPublic>
}