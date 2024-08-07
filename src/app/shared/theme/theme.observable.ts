import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ITheme } from './theme.interface';
import { AuthenticatedProfileObservable, IProfile } from '@belomonte/nostr-credential-ngx';

@Injectable({
  providedIn: 'root'
})
export class ThemeObservable extends BehaviorSubject<ITheme> {

  private static instance: ThemeObservable | null = null;

  constructor(
    private profile$: AuthenticatedProfileObservable
  ) {
    const profile: any = profile$.getValue(); // FIXME: remover any
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
    // FIXME: remover any
    const base = (profile as any)?.theme || 'darker';
    const color = (profile as any)?.color || 'blue';

    return { base, color };
  }
}
