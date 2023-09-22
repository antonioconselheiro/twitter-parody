import { Injectable } from "@angular/core";
import { DataLoadType } from "@domain/data-load.type";
import { ITweet } from "@domain/tweet.interface";

@Injectable()
export class TweetFacade {
  listTweetsFrom(npub: string): Promise<ITweet<DataLoadType.EAGER_LOADED>> {

  }

  listReactionsFrom(npub: string): Promise<ITweet<DataLoadType.EAGER_LOADED>> {

  }

}