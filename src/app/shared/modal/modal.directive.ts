// eslint-disable-next-line max-len
import { Directive, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { IModalMetadata } from './modal-metadata.interface';
import { ModalableDirective } from './modalable.directive';
import { IOpenable } from '@shared/util/openable.interface';
import { ICloseable } from '@shared/util/closeable.interface';

@Directive()
export abstract class ModalDirective implements OnInit, OnDestroy, IOpenable, ICloseable {

  abstract tagNameElement: string;
  abstract modalInject$: Observable<IModalMetadata<unknown, unknown>>;

  isOpen = false;
  title?: string;
  content: ModalableDirective<unknown, unknown> | null = null;
  classes: string[] = [];

  private subscriptions = new Subscription();

  abstract container: ViewContainerRef | null;

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
          //  jogando processamento no próximo tick
          // eslint-disable-next-line ban/ban
          setTimeout(() =>{
            this.title = modalMetaData.title;
            this.open();
            this.openModal(modalMetaData);
          })
        }
      }));
  }

  open(): void {
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
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
    if (content.onInjectData) {
      content.onInjectData(modalMetaData.data || null);
    }

    modalMetaData.response.subscribe({
      error: this.closeModal.bind(this),
      complete: this.closeModal.bind(this)
    });
  }

  closeModal(error?: unknown): void {
    const container = this.container;
    if (container) {
      //  jogando processamento no próximo tick
      // eslint-disable-next-line ban/ban
      setTimeout(() => {
        container.clear();
        this.close();
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
