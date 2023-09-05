import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { ProfileApi } from "../../shared/profile-service/profile.api";
import { inject } from "@angular/core";
import { ITweet } from "@domain/tweet.interface";
import { IProfile } from "@shared/profile-service/profile.interface";
import { ProfilesObservable } from "@shared/profile-service/profiles.observable";

export const profileResolverFn: ResolveFn<IProfile> =
    (route: ActivatedRouteSnapshot) => inject(ProfilesObservable).get(route.params['npub']);

export const profileTweetListResolverFn: ResolveFn<ITweet[]> =
    (route: ActivatedRouteSnapshot) => inject(ProfileApi).listTweets(route.params['npub']);
