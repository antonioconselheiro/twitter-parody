import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { Account, ProfileProxy } from "@belomonte/nostr-ngx";

export const nip05ResolveFn: ResolveFn<Account | null> =
  (route: ActivatedRouteSnapshot) => inject(ProfileProxy).loadAccountUsingNip05(route.params['nip05'], 'complete');