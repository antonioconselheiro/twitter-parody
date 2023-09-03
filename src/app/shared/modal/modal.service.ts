import { Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AlertType } from './alert/alert-type.enum';
import { AlertComponent } from './alert/alert.component';
import { ModalConfirmComponent } from './modal-confirm/modal-confirm.component';
import { ModalBuilder } from './modal.builder';
import { ModalableDirective } from './modalable.directive';

@Injectable()
export class ModalService {

  createModal<EntryType, ReturnType>(
    component: Type<ModalableDirective<EntryType, ReturnType>>
  ): ModalBuilder<EntryType, ReturnType> {
    return new ModalBuilder<EntryType, ReturnType>(component);
  }

  alertSuccess(message: string, title?: string): Observable<void> {
    const data = {
      message,
      title,
      alertType: AlertType.SUCCESS
    };

    return new ModalBuilder(AlertComponent)
      .setData(data)
      .setRootCssClasses(['is-success'])
      .build();
  }

  alertError(message: string): Observable<void> {
    return new ModalBuilder(AlertComponent)
      .setData({ message, alertType: AlertType.ERROR })
      .setRootCssClasses(['is-error'])
      .build();
  }

  confirm(title: string, message: string, buttonOk?: string, buttonCancel?: string): Observable<boolean> {
    return new ModalBuilder(ModalConfirmComponent)
      .setData({ title, message, buttonOk, buttonCancel })
      .build()
      .pipe(map(result => !!result));
  }
}
