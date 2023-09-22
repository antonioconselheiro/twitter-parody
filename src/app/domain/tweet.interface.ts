import { SafeHtml } from '@angular/platform-browser';
import { DataLoadType } from './data-load.type';
import { IReaction } from './reaction.interface';
import { TEventId } from './event-id.type';
import { TNostrPublic } from './nostr-public.type';
import Geohash from 'latlon-geohash';

export type ITweet<T extends DataLoadType | unknown = unknown> = {
  id: TEventId;
  load: T;
  reactions: IReaction[];
  repling?: TEventId;
  retweetedBy?: TEventId[];
  retweeting?: TEventId;
  replies?: TEventId[];
} & ({
  load: DataLoadType.EAGER_LOADED;
  author: TNostrPublic;
  content: string;
  htmlFullView: SafeHtml;
  htmlSmallView: SafeHtml;
  urls: string[];
  imgList: string[];
  imgMatriz: [string, string?][];
  location?: Geohash.Point;
  created: number;
  view?: number;
} | {
  load: DataLoadType.LAZY_LOADED;
  author?: string;
})
