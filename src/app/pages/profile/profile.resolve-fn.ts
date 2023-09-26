import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { IProfile } from "@domain/profile.interface";
import { ProfileProxy } from "@shared/profile-service/profile.proxy";

export const profileResolverFn: ResolveFn<IProfile> =
    (route: ActivatedRouteSnapshot) => inject(ProfileProxy).load(route.params['npub']);
