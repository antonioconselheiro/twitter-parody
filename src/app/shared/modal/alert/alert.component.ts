import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalableDirective } from '../modalable.directive';
import { AlertType } from './alert-type.enum';

@Component({
  selector: 'tw-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent extends ModalableDirective<{
  message: string,
  title?: string,
  alertType: AlertType
}, void> {

  readonly ALERT_TYPE_SUCCESS = AlertType.SUCCESS;
  readonly ALERT_TYPE_ERROR = AlertType.ERROR;

  response = new Subject<void>();
  titulo: string | null = null;
  mensagem: string | null = null;
  alertType: AlertType | null = null;

  override onInjectData(data: { message: string, title?: string, alertType: AlertType } | null): void {
    if (data) {
      this.mensagem = data.message;
      this.alertType = data.alertType;
    }
    if (data?.title) {
      this.titulo = data.title;
    }
  }

  override close(): void {
    this.response.next();
    super.close();
  }
}
