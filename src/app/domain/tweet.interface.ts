import { SafeHtml } from '@angular/platform-browser';
import { NPub } from '@belomonte/nostr-ngx';
import Geohash from 'latlon-geohash';
import { TweetReactionRecord } from './tweet-reaction.record';
import { TweetZapRecord } from './tweet-zap.record';

export interface Tweet {
  id: string;
  reactions: TweetReactionRecord;
  zaps: TweetZapRecord;
  rootRepling?: string;
  repling?: string;
  retweetedBy?: { [eventId: string]: NPub };
  retweeting?: string;
  replies?: string[];
  author: NPub;
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
}
