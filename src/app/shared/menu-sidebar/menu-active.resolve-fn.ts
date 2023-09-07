import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, ResolveFn } from "@angular/router";
import { MenuActiveObservable } from "./menu-active.observable";
import { MenuType } from "./menu-type.enum";

export const menuActiveResolverFn: ResolveFn<MenuType | null> =
    (route: ActivatedRouteSnapshot) => inject(MenuActiveObservable).activate(route.data['menu'] || null);
