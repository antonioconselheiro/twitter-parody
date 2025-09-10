import { Component } from '@angular/core';
import { FeedViewModel } from '@belomonte/nostr-ngx';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';

@Component({
  selector: 'tw-event-page',
  templateUrl: './event-page.component.html',
  styleUrl: './event-page.component.scss'
})
export class EventPageComponent extends AbstractEntitledComponent {
  override title = 'Tweet';

  loading = true;
  feed: FeedViewModel | null = null;
}
