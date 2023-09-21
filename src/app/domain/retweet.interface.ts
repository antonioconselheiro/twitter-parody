import { DataLoadType } from "./data-load.type";
import { EventId } from "./event-id.type";
import { ITweet } from "./tweet.interface";

export interface IRetweet extends ITweet<DataLoadType.EAGER_LOADED> {
  retweeting: EventId;
}
