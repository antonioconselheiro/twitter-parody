import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalableDirective } from '../modalable.directive';

@Component({
  selector: 'tw-modal-confirm',
  templateUrl: './modal-confirm.component.html',
  styleUrls: ['./modal-confirm.component.scss']
})
export class ModalConfirmComponent extends ModalableDirective<{
  message: string,
  title?: string,
  buttonOk?: string,
  buttonCancel?: string
}, boolean> {

  response = new Subject<boolean | void>();
  titulo: string | null = null;
  mensagem: string | null = null;

  buttonOk = 'Ok';
  buttonCancel = 'Cancelar';

  override onInjectData(data: { message: string, title?: string, buttonOk?: string, buttonCancel?: string } | null): void {
    if (data) {
      this.mensagem = data.message;

      if (data.title) {
        this.titulo = data.title;
      }

      if (data.buttonOk) {
        this.buttonOk = data.buttonOk;
      }

      if (data.buttonCancel) {
        this.buttonCancel = data.buttonCancel;
      }
    }

  }

  onClickButtonOk(): void {
    this.response.next(true);
    super.close();
  }

  onClickButtonCancel(): void {
    this.response.next(false);
    super.close();
  }

  override close(): void {
    this.response.next(false);
    super.close();
  }
}
