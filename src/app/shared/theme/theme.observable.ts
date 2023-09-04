import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ITheme } from './theme.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeObservable extends BehaviorSubject<ITheme> {

  private static instance: ThemeObservable | null = null;

  constructor() {
    //  TODO: ler de store ou de banco local
    super({
      base: 'darker',
      color: 'blue'
    });

    if (!ThemeObservable.instance) {
      ThemeObservable.instance = this;
    }

    return ThemeObservable.instance;
  }
  
}
