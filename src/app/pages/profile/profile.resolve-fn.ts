import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { IProfile, ProfileProxy } from "@belomonte/nostr-credential-ngx";

export const profileResolverFn: ResolveFn<IProfile> =
    (route: ActivatedRouteSnapshot) => inject(ProfileProxy).load(route.params['npub']);
