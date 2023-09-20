import { IProfile } from '@shared/profile-service/profile.interface';
import { IReaction } from './reaction.interface';
import { DataLoadType } from './data-load-type';
import { SafeHtml } from '@angular/platform-browser';

export type ITweet = {
  id: string;
  author: IProfile;
  content: string;
  htmlFullView: SafeHtml;
  htmlSmallView: SafeHtml;
  urls: string[];
  imgList: string[];
  imgMatriz: [string, string?][];
  reactions: IReaction[];
  reply: ITweet[];
  location?: { lat: number, lon: number };
  retweeted?: ITweet[];
  retweeting?: ITweet;
  replies?: ITweet[];
  created: number;
  view?: number;
  load: DataLoadType.EAGER_LOADED;
} | {
  id: string;
  author?: IProfile;
  content?: string;
  htmlFullView?: SafeHtml;
  htmlSmallView?: SafeHtml;
  urls?: string[];
  imgList?: string[];
  imgMatriz?: [string, string?][];
  reactions: IReaction[];
  reply?: ITweet[];
  location?: { lat: number, lon: number };
  retweeted?: ITweet[];
  retweeting?: ITweet;
  replies?: ITweet[];
  created?: number;
  view?: number;
  load: DataLoadType.LAZY_LOADED;
}
