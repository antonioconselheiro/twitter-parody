import { Feed } from "../../view-model/feed.type";
import { UnloadedFeedRefences } from "../../view-model/unloaded-feed-references.interface";

export interface RelatedFeedAggregator {
  feed: Feed;
  unloaded: UnloadedFeedRefences;
}
