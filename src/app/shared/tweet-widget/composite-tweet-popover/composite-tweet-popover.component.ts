import { Component } from '@angular/core';
import { ModalableDirective } from '@belomonte/async-modal-ngx';
import { Subject } from 'rxjs';

@Component({
  selector: 'tw-composite-tweet-popover',
  templateUrl: './composite-tweet-popover.component.html',
  styleUrls: ['./composite-tweet-popover.component.scss']
})
export class CompositeTweetPopoverComponent extends ModalableDirective<void, string> {
  response = new Subject<string | void>();
}
