import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Account, ProfileProxy } from '@belomonte/nostr-ngx';

export const accountResolverFn: ResolveFn<Account> =
    (route: ActivatedRouteSnapshot) => inject(ProfileProxy).loadAccountUsingNPub(route.params['npub'], 'complete');
