import { Tweet } from "./tweet.interface";

export interface Retweet extends Tweet {
  retweeting: string;
}
