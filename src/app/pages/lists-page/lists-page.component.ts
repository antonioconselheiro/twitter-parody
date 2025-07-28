import { Component } from '@angular/core';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';

@Component({
  selector: 'tw-lists-page',
  templateUrl: './lists-page.component.html',
  styleUrls: ['./lists-page.component.scss']
})
export class ListsPageComponent extends AbstractEntitledComponent {
  override title = 'Lists';
}
