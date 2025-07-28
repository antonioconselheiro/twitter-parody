import { Component } from '@angular/core';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';
import { FeedViewModel } from '@view-model/feed.view-model';

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
