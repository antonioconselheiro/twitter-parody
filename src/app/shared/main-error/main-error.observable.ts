import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainErrorObservable extends Subject<unknown> {

  private static instance: MainErrorObservable | null = null;

  constructor() {
    super();
    if (!MainErrorObservable.instance) {
      MainErrorObservable.instance = this;
    }
    return MainErrorObservable.instance;
  }
}
