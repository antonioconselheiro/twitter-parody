import { Component } from '@angular/core';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';

@Component({
  selector: 'tw-communities-page',
  templateUrl: './communities-page.component.html',
  styleUrls: ['./communities-page.component.scss']
})
export class CommunitiesPageComponent extends AbstractEntitledComponent {
  override title = 'Communities';
}
