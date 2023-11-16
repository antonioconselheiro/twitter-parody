import { DataLoadType } from "./data-load.type";
import { TEventId } from "./event-id.type";
import { ITweet } from "./tweet.interface";

export interface IRetweet extends ITweet<DataLoadType.EAGER_LOADED> {
  retweeting: TEventId;
}
