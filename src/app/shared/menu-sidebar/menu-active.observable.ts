import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { MenuType } from './menu-type.enum';

@Injectable({
  providedIn: 'root'
})
export class MenuActiveObservable extends BehaviorSubject<MenuType | null> {

  private static instance: MenuActiveObservable | null = null;

  constructor() {
    super(null);
    if (!MenuActiveObservable.instance) {
      MenuActiveObservable.instance = this;
    }
    return MenuActiveObservable.instance;
  }

  activate(menu: MenuType | null): MenuType | null {
    this.next(menu);
    return menu;
  }
}
