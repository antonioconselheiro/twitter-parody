import { Tweet } from "./tweet.interface";

export interface IRetweet extends Tweet {
  retweeting: string;
}
