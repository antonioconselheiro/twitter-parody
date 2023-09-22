import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { IProfile } from "@shared/profile-service/profile.interface";
import { AuthProfileObservable } from "@shared/profile-service/profiles.observable";

export const profileResolverFn: ResolveFn<IProfile> =
    (route: ActivatedRouteSnapshot) => inject(AuthProfileObservable).load(route.params['npub']);
