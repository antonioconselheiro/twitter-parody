import { Injectable } from '@angular/core';
import { ICloseable } from '@shared/util/closeable.interface';
import { IOpenable } from '@shared/util/openable.interface';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuSidebarMobileObservable extends Subject<boolean> implements IOpenable, ICloseable {

  private static instance: MenuSidebarMobileObservable | null = null;

  constructor() {
    super();
    if (!MenuSidebarMobileObservable.instance) {
      MenuSidebarMobileObservable.instance = this;
    }
    return MenuSidebarMobileObservable.instance;
  }

  open(): void {
    this.next(true);
  }

  close(): void {
    this.next(false)
  }
}
