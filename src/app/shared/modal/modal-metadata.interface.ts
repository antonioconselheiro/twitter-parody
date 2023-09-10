import { Type } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalableDirective } from './modalable.directive';

export interface IModalMetadata<EntryType, ReturnType> {
  component: Type<ModalableDirective<EntryType, ReturnType>>;
  response: Subject<ReturnType>;
  cssClasses: string[];
  title?: string;
  data: EntryType;
}
