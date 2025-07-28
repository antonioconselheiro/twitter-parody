import { Component } from '@angular/core';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';

@Component({
  selector: 'tw-network-page',
  templateUrl: './network-page.component.html',
  styleUrls: ['./network-page.component.scss']
})
export class NetworkPageComponent extends AbstractEntitledComponent {
  override title = 'Network';
}
