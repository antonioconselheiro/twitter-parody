import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkErrorObservable extends Subject<unknown> {

  private static instance: NetworkErrorObservable | null = null;

  constructor() {
    super();
    if (!NetworkErrorObservable.instance) {
      NetworkErrorObservable.instance = this;
    }
    return NetworkErrorObservable.instance;
  }
}
