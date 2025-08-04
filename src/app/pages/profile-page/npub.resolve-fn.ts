import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Account, ProfileProxy } from '@belomonte/nostr-ngx';

export const npubResolverFn: ResolveFn<Account> =
  (route: ActivatedRouteSnapshot) => inject(ProfileProxy).loadAccountUsingNPub(route.params['npub'], 'complete');
