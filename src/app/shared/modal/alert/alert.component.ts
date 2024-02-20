import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { ModalableDirective } from '@belomonte/async-modal-ngx';
import { AlertType } from './alert-type.enum';

@Component({
  selector: 'tw-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent extends ModalableDirective<{
  title: string,
  message: string,
  alertType: AlertType
}, void> {

  readonly ALERT_TYPE_SUCCESS = AlertType.SUCCESS;
  readonly ALERT_TYPE_ERROR = AlertType.ERROR;

  response = new Subject<void>();
  message: string | null = null;
  alertType: AlertType | null = null;

  override onInjectData(data: { message: string, alertType: AlertType } | null): void {
    if (data) {
      this.message = data.message;
      this.alertType = data.alertType;
    }
  }

  override close(): void {
    this.response.next();
    super.close();
  }
}
