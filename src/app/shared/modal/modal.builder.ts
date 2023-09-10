import { Type } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, first } from 'rxjs/operators';
import { IModalMetadata } from './modal-metadata.interface';
import { ModalableDirective } from './modalable.directive';

export class ModalBuilder<EntryType, ReturnType> {

  private static modalInjectSubject = new Subject<IModalMetadata<unknown, unknown>>();
  static modalInject$ = ModalBuilder.modalInjectSubject;

  private injectData: EntryType | null = null;
  private cssClasses: string[] = [];
  private router?: Router;
  private title?: string;

  private subscription = new Subscription();

  constructor(private component: Type<ModalableDirective<EntryType, ReturnType>>) { }

  setData(data: EntryType): ModalBuilder<EntryType, ReturnType> {
    this.injectData = data;
    return this;
  }

  setTitle(title: string): ModalBuilder<EntryType, ReturnType> {
    this.title = title;
    return this;
  }

  /**
   * Close modal when route change
   */
  setBindToRoute(router: Router): ModalBuilder<EntryType, ReturnType> {
    this.router = router;
    return this;
  }

  setRootCssClasses(classes: string[]): ModalBuilder<EntryType, ReturnType> {
    this.cssClasses = classes;
    return this;
  }

  /**
   * O tipo void sempre deve ser considerado como retorno, isso deve ocorrer por que
   * quando o observable for convertido para promise ele vai fundir o next com o complete
   * e quando não houver retorno de next, por conta de uma fechada forçada do modal, o promise
   * receberá um void
   */
  build(): Observable<ReturnType | void> {
    const response = new Subject<ReturnType>();
    const data = this.injectData as unknown;
    const component = this.component as Type<ModalableDirective<unknown, unknown>>;

    if (this.router) {

      //  FIXME: ver uma forma de ignorar alteração de rota para query params
      this.subscription.add(this.router.events
        .pipe(filter(nagivation => nagivation instanceof NavigationStart))
        .pipe(first())
        .subscribe(() => {
          if (!response.closed) {
            response.complete();
          }
        }));

      this.subscription.add(response.subscribe({
        complete: () => this.subscription.unsubscribe()
      }));
    } else {
      console.warn(
        `Componente "${component.name}" servido como modal não foi associado a ` +
        'rota e não será removido automaticamente caso a rota seja mudada'
      );
    }

    ModalBuilder.modalInjectSubject.next({
      component, data,
      cssClasses: this.cssClasses,
      title: this.title,
      response: response as Subject<unknown>
    });

    return response.asObservable();
  }
}
