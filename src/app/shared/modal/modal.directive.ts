// eslint-disable-next-line max-len
import { Directive, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { MainErrorObservable } from '@shared/main-error/main-error.observable';
import { Observable, Subscription } from 'rxjs';
import { IModalMetadata } from './modal-metadata.interface';
import { ModalableDirective } from './modalable.directive';

@Directive()
export abstract class ModalDirective implements OnInit, OnDestroy {

  abstract tagNameElement: string;
  abstract modalInject$: Observable<IModalMetadata<unknown, unknown>>;

  isVisible = false;
  isOpen = false;
  content: ModalableDirective<unknown, unknown> | null = null;
  classes: string[] = [];
  subscriptions = new Subscription();

  abstract container: ViewContainerRef | null;

  protected abstract error$: MainErrorObservable;

  ngOnInit(): void {
    this.listenModalInjection();
  }

  checkCloseClick(event: KeyboardEvent): void {
    const element = event.target as HTMLElement;
    const tagNameElementClose = this.tagNameElement.toUpperCase();

    if (element.tagName === tagNameElementClose) {
      this.closeModal();
    }
  }

  private listenModalInjection(): void {
    this.subscriptions.add(
      this.modalInject$.subscribe({
        next: modalMetaData => {
          setTimeout(() =>{
            this.isOpen = true;
            this.isVisible = true;
            this.openModal(modalMetaData);
          })
        },
        error: error => this.error$.next(error)
      }));
  }

  getClasses(classes?: string[]): string {
    classes = classes || [];
    return classes.concat(this.classes).join(' ');
  }

  private openModal(modalMetaData: IModalMetadata<unknown, unknown>): void {
    const container = this.container;
    if (!container) {
      console.error(
        'Impossível criar modal: o atributo this.container está vazio, houve alguma ' +
        'manutenção recente na parte de modais? #modalContainer mudou de nome?'
      );
      return;
    }

    container.clear();  //  remove componentes antigos que não foram removidos corretamente
    const content = this.content = container.createComponent(modalMetaData.component).instance;
    this.classes = modalMetaData.cssClasses;

    if (!content) {
      console.error(`Não foi possível criar componente ${modalMetaData.component.name} dentro do container de modal.`);
      return;
    }

    content.response = modalMetaData.response;
    content.onInjectData(modalMetaData.data || null);

    modalMetaData.response.subscribe({
      error: this.closeModal.bind(this),
      complete: this.closeModal.bind(this)
    });
  }

  closeModal(error?: unknown): void {
    const container = this.container;
    if (container) {
      setTimeout(() => {
        container.clear();
        this.isOpen = false;
        document.body.classList.remove('has-menu-active');
        this.content?.response.complete();
      });
    } else {
      console.error('Impossível criar modal this.container, que contém o elemento da modal está vazio', error);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
