import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Account, ProfileService } from '@belomonte/nostr-ngx';

export const profileResolverFn: ResolveFn<Account> =
    (route: ActivatedRouteSnapshot) => inject(ProfileService).getAccountUsingNPub(route.params['npub']);
