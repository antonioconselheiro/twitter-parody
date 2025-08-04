import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { Account, Nip05Proxy } from "@belomonte/nostr-ngx";

export const nip05ResolverFn: ResolveFn<Account | null> =
  (route: ActivatedRouteSnapshot) => inject(Nip05Proxy).queryProfile(route.params['npub'], 'complete');