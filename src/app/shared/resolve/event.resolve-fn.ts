import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot } from "@angular/router";
import { NoteViewModel } from "@belomonte/nostr-ngx";
import { TweetProxy } from "@shared/tweet-service/tweet.proxy";

export const eventResolveFn: ResolveFn<NoteViewModel | null> =
  (route: ActivatedRouteSnapshot) => inject(TweetProxy).loadTweet(route.params['event']);