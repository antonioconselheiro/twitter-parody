import { Component } from '@angular/core';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';

@Component({
  selector: 'tw-notifications-page',
  templateUrl: './notifications-page.component.html',
  styleUrls: ['./notifications-page.component.scss']
})
export class NotificationsPageComponent extends AbstractEntitledComponent {
  override title = 'Notifications';
}
