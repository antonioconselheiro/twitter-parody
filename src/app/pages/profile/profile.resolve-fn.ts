import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { ProfileService } from '@belomonte/nostr-ngx';
import { NostrMetadata } from '@nostrify/nostrify';

export const profileResolverFn: ResolveFn<NostrMetadata | null> =
    (route: ActivatedRouteSnapshot) => inject(ProfileService).get(route.params['npub']);
