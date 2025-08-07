import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Account, ProfileProxy } from '@belomonte/nostr-ngx';

export const nprofileResolveFn: ResolveFn<Account> =
  (route: ActivatedRouteSnapshot) => inject(ProfileProxy).loadAccountUsingNProfile(route.params['nprofile'], 'complete');
