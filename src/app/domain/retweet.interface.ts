import { ITweet } from "./tweet.interface";

export interface IRetweet extends ITweet {
  retweeting: string;
}
