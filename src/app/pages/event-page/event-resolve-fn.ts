import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { TweetProxy } from "@shared/tweet-service/tweet.proxy";
import { NostrEventViewModel } from "@view-model/nostr-event.view-model";

export const eventResolverFn: ResolveFn<NostrEventViewModel> =
    (route: ActivatedRouteSnapshot) => inject(TweetProxy).loadTweet(route.params['nevent']);
