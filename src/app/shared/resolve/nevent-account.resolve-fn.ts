import { inject } from "@angular/core";
import { ResolveFn, ActivatedRouteSnapshot } from "@angular/router";
import { TweetProxy } from "@shared/tweet-service/tweet.proxy";
import { NoteViewModel } from "@view-model/note.view-model";

export const neventAccountResolveFn: ResolveFn<NoteViewModel | null> =
  (route: ActivatedRouteSnapshot) => {
  debugger;  
    return inject(TweetProxy).loadTweet(route.params['nevent'])
  };
