import { Component, OnDestroy, OnInit } from '@angular/core';
import { MainErrorObservable } from '@shared/main-error/main-error.observable';
import { NetworkErrorObservable } from '@shared/main-error/network-error.observable';
import { ITheme } from '@shared/theme/theme.interface';
import { ThemeObservable } from '@shared/theme/theme.observable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();
  isModalOpen = false;

  constructor(
    private error$: MainErrorObservable,
    private network$: NetworkErrorObservable,
    private theme$: ThemeObservable
  ) { }

  ngOnInit(): void {
    this.bindThemes();
    this.bindErrorSubscription();
    this.bindNetworkErrorSubscription();
  }

  private bindThemes(): void {
    this.subscriptions.add(this.theme$.subscribe({
      next: theme => this.setCurrentTheme(theme)
    }));    
  }

  private bindErrorSubscription(): void {
    this.subscriptions.add(this.error$.subscribe({
      next: error => console.error(error)
    }));
  }

  private bindNetworkErrorSubscription(): void {
    this.subscriptions.add(this.network$.subscribe({
      next: error => console.error(error)
    }));
  }

  private setCurrentTheme(theme: ITheme): void {
    if (['darker', 'light', 'dark'].includes(theme.base)) {
      document.body.setAttribute('data-theme', theme.base);
    }

    if (['blue',  'yellow',  'magenta',  'purple',  'orange',  'green'].includes(theme.color)) {
      document.body.setAttribute('data-color', theme.color);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
