import { Tweet } from "../../deprecated-domain/tweet.interface";

export interface TweetRelationedInfoWrapper {
  eager: Array<Tweet>;
  lazy: Array<string>;
  pubkeys: Array<string>
}