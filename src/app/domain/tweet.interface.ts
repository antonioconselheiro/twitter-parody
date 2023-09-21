import { SafeHtml } from '@angular/platform-browser';
import { DataLoadType } from './data-load.type';
import { IReaction } from './reaction.interface';
import { EventId } from './event-id.type';
import { NostrPublicType } from './nostr-public.type';
import Geohash from 'latlon-geohash';

export type ITweet<T extends DataLoadType | unknown = unknown> = {
  id: EventId;
  load: T;
  reactions: IReaction[];
  repling?: EventId;
  retweeted?: EventId[];
  retweeting?: EventId;
  replies?: EventId[];
} & ({
  load: DataLoadType.EAGER_LOADED;
  author: NostrPublicType;
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
