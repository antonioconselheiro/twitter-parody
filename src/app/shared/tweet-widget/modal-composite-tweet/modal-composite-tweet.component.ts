import { Component } from '@angular/core';
import { ModalableDirective } from '@belomonte/async-modal-ngx';
import { Subject } from 'rxjs';

@Component({
  selector: 'tw-modal-composite-tweet',
  templateUrl: './modal-composite-tweet.component.html',
  styleUrls: ['./modal-composite-tweet.component.scss']
})
export class ModalCompositeTweetComponent extends ModalableDirective<void, string> {
  response = new Subject<string | void>();
}
