import { Injectable } from '@angular/core';
import { CurrentProfileObservable, NostrMetadata } from '@belomonte/nostr-ngx';
import { BehaviorSubject } from 'rxjs';
import { Theme } from './theme.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeObservable extends BehaviorSubject<Theme> {

  private static instance: ThemeObservable | null = null;

  constructor(
    private profile$: CurrentProfileObservable
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
    this.listenProfileSubscription();
  }

  private listenProfileSubscription(): void {
    this.profile$.subscribe({
      next: profile => this.next(this.themeFromProfile(profile?.metadata))
    });
  }

  private themeFromProfile(profile: NostrMetadata | undefined | null): { base: string, color: string } {
    // FIXME: remover any
    const base = (profile as any)?.theme || 'darker';
    const color = (profile as any)?.color || 'blue';

    return { base, color };
  }
}
