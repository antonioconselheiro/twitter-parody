import { Injectable } from "@angular/core";
import { DataLoadType } from "@domain/data-load.type";
import { EventId } from "@domain/event-id.type";
import { ITweet } from "@domain/tweet.interface";

/**
 * This class responsible for caching event information
 * involving tweets, including events: Text (1), Deleted (5),
 * Reaction (6), Repost (7) and Zapped (9735).
 * 
 * the events will be processed and stored in the format of
 * tweet interfaces, and will also be associated in their
 * appropriate relationships (who retweeted who? threaded
 * responses and threaded threads), through a property or
 * list containing the ids of the events that are related,
 * to avoid relationships circulate between the structure
 * preventing it from being serialized and cached
 */
@Injectable()
export class TweetStatefull {
  get(idEvent: EventId): ITweet<DataLoadType.EAGER_LOADED> {
    return {} as ITweet<DataLoadType.EAGER_LOADED>;
  }
}