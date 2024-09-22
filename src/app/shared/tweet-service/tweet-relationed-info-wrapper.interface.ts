import { Tweet } from "@domain/tweet.interface";

export interface ITweetRelationedInfoWrapper {
  eager: Array<Tweet>;
  lazy: Array<string>;
  pubkeys: Array<string>
}