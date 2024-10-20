import { Injectable } from '@angular/core';
import { NostrEvent } from '@nostrify/nostrify';
import { Feed } from '../../view-model/feed.type';

@Injectable({
  providedIn: 'root'
})
export class FeedMapper {

  toViewModel(events: Array<NostrEvent>): Promise<Feed> {

  }
}
