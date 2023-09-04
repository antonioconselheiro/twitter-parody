import { Directive, OnDestroy, OnInit } from '@angular/core';
import { ICloseable } from '@shared/util/closeable.interface';
import { Subject } from 'rxjs';

@Directive()
export abstract class ModalableDirective<EntryType, ReturnType> implements ICloseable {

  abstract response: Subject<ReturnType | void>;

  onInjectData?(data: EntryType): void;

  close(): void {
    this.response.complete();
  }
}
