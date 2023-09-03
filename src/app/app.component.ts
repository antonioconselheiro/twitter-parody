import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalBuilder } from '@shared/modal/modal.builder';
import { ITheme } from '@shared/theme/theme.interface';
import { ThemeObservable } from '@shared/theme/theme.observable';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();
  isModalOpen = false;

  constructor(
    private theme$: ThemeObservable
  ) {}

  ngOnInit(): void {
    this.bindCustomModal();
    this.bindThemes();
  }
  
  private bindCustomModal(): void {
    this.subscriptions.add(
      ModalBuilder.modalInject$.subscribe({
        next: is => this.isModalOpen = !!is
      })
    );
  }

  private bindThemes(): void {
    this.subscriptions.add(this.theme$.subscribe({
      next: theme => this.setCurrentTheme(theme)
    }));    
  }

  private setCurrentTheme(theme: ITheme): void {
    document.body.setAttribute('data-theme', theme.base);
    document.body.setAttribute('data-color', theme.color);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
