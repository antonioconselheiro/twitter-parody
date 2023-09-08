import { IProfile } from '@shared/profile-service/profile.interface';
import { IReaction } from './reaction.interface';
import { DataLoadType } from './data-load-type';

export type ITweet = {
  id: string;
  author: IProfile;
  content: string;
  reactions: IReaction[];
  reply: ITweet[];
  location?: { lat: number, lon: number };
  retweeting?: ITweet;
  created: number;
  load: DataLoadType.EAGER_LOADED;
} | {
  id: string;
  author?: IProfile;
  content?: string;
  reactions: IReaction[];
  reply?: ITweet[];
  location?: { lat: number, lon: number };
  retweeting?: ITweet;
  created?: number;
  load: DataLoadType.LAZY_LOADED;
}
