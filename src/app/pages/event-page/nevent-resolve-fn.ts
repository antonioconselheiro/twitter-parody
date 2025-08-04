import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { TweetProxy } from "@shared/tweet-service/tweet.proxy";
import { NoteViewModel } from "@view-model/note.view-model";

export const neventResolverFn: ResolveFn<NoteViewModel | null> =
  (route: ActivatedRouteSnapshot) => inject(TweetProxy).loadTweet(route.params['nevent']);
