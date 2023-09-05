import { IProfile } from '@shared/profile-service/profile.interface';
import { IReaction } from './reaction.interface';
import { TweetLoadType } from './tweet-load-type';

export type ITweet = {
  author: IProfile;
  content: string;
  reactions: IReaction[];
  reply: ITweet[];
  retweet?: ITweet;
  created: number;
  load: TweetLoadType.EAGER_LOADED;
} | {
  author?: IProfile;
  content?: string;
  reactions: IReaction[];
  reply?: ITweet[];
  retweet?: ITweet;
  created?: number;
  load: TweetLoadType.LAZY_LOADED;
}
