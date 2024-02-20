import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalableDirective } from '@belomonte/async-modal-ngx';

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
  message: string | null = null;

  buttonOk = 'Ok';
  buttonCancel = 'Cancelar';

  override onInjectData(data: { message: string, buttonOk?: string, buttonCancel?: string } | null): void {
    if (data) {
      this.message = data.message;

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
