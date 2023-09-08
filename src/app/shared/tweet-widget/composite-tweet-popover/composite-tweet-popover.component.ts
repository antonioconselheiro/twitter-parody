import { Component } from '@angular/core';
import { ModalableDirective } from '@shared/modal/modalable.directive';
import { Subject } from 'rxjs';

@Component({
  selector: 'tw-composite-tweet-popover',
  templateUrl: './composite-tweet-popover.component.html',
  styleUrls: ['./composite-tweet-popover.component.scss']
})
export class CompositeTweetPopoverComponent extends ModalableDirective<void, string> {
  response = new Subject<string | void>();
}
