import { Directive, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class ModalableDirective<EntryType, ReturnType> implements OnInit, OnDestroy {

  abstract response: Subject<ReturnType | void>;

  abstract onInjectData(data: EntryType): void;

  protected removeBodyModalClass(): void {
    document.body.classList.remove('has-menu-active');
  }

  protected setBodyModalClass(): void {
    document.body.classList.add('has-menu-active');

  }

  ngOnInit(): void {
    this.setBodyModalClass();
  }

  close(): void {
    this.removeBodyModalClass();
    this.response.complete();
  }

  ngOnDestroy(): void {
    //  caso o usuário seja removido da tela por, por exemplo, token expirado,
    //  então o scroll deve ser reestabelecido. Solução do issue: VHO-184
    this.removeBodyModalClass();
  }
}
