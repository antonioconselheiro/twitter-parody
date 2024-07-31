import { SafeHtml } from '@angular/platform-browser';
import Geohash from 'latlon-geohash';
import { DataLoadType } from './data-load.type';
import { TEventId } from './event-id.type';
import { ITweetReactionMap } from './tweet-reaction-map.interface';
import { ITweetZapMap } from './tweet-zap-map.interface';
import { TNostrPublic } from '@belomonte/nostr-ngx';

export type ITweet<T extends DataLoadType | unknown = unknown> = {
  id: TEventId;
  load: T;
  reactions: ITweetReactionMap;
  zaps: ITweetZapMap;
  rootRepling?: TEventId;
  repling?: TEventId;
  retweetedBy?: { [attr: TEventId]: TNostrPublic };
  retweeting?: TEventId;
  replies?: TEventId[];
} & ({
  load: DataLoadType.EAGER_LOADED;
  author: TNostrPublic;
  content: string;

  /**
   * use htmlSmallView instead
   */
  htmlSmallViewLoaded?: SafeHtml;

  /**
   * use htmlFullView instead
   */
  htmlFullViewLoaded?: SafeHtml;

  htmlSmallView: SafeHtml;
  htmlFullView: SafeHtml;
  urls: string[];
  imageList: string[];
  videoUrl?: string;
  imgMatriz: [string, string?][];
  location?: Geohash.Point;
  created: number;
  view?: number;
} | {
  load: DataLoadType.LAZY_LOADED;
  author?: TNostrPublic;
})
