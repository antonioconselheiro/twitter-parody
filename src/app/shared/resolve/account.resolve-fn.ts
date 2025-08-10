import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { Account, ProfileProxy } from "@belomonte/nostr-ngx";

export const accountResolveFn: ResolveFn<Account> =
  (route: ActivatedRouteSnapshot) => inject(ProfileProxy).loadAccount(route.params['pubkey'], 'complete');