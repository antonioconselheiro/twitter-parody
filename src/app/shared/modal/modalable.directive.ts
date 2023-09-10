import { Directive } from '@angular/core';
import { ICloseable } from '@shared/util/closeable.interface';
import { Subject } from 'rxjs';

@Directive()
export abstract class ModalableDirective<EntryType, ReturnType> implements ICloseable {

  abstract response: Subject<ReturnType | void>;

  title?: string;

  onInjectData?(data: EntryType): void;

  close(): void {
    this.response.complete();
  }
}
