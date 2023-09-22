import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITheme } from './theme.interface';
import { AuthProfileObservable } from '@shared/profile-service/profiles.observable';
import { IProfile } from '@shared/profile-service/profile.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeObservable extends BehaviorSubject<ITheme> {

  private static instance: ThemeObservable | null = null;

  constructor(
    private profile$: AuthProfileObservable
  ) {
    const profile = profile$.getValue();
    const base = profile?.theme || 'darker';
    const color = profile?.color || 'blue';
    super({ base, color });

    if (!ThemeObservable.instance) {
      ThemeObservable.instance = this;
      this.init();
    }

    return ThemeObservable.instance;
  }

  private init(): void {
    this.bindProfileSubscription();
  }

  private bindProfileSubscription(): void {
    this.profile$.subscribe({
      next: profile => this.next(this.themeFromProfile(profile))
    });
  }

  private themeFromProfile(profile: IProfile | null): { base: string, color: string } {
    const base = profile?.theme || 'darker';
    const color = profile?.color || 'blue';

    return { base, color };
  }
  
}
