import { TestBed } from '@angular/core/testing';
import { TweetApi } from './tweet.api';

class TweetApiMock extends TweetApi {
  override listTweetsFrom(npub: string): Promise<Event<NostrEventKind.Text | NostrEventKind.Repost>[]> {

  }

  override listReactionsFrom(npub: string): Promise<Event<NostrEventKind.Reaction>[]> {

  }
  override listReactionsFromNostrPublic(npub: string): Promise<
    Array<ITweet<DataLoadType.EAGER_LOADED> | IRetweet>
  >{

  }

  override loadRelatedEvents(events: TEventId[]): Promise<Event<
    NostrEventKind.Text | NostrEventKind.Repost | NostrEventKind.Reaction | NostrEventKind.Zap
  >[]> {

  }
}

describe('TweetProxy', () => {
  let service: TweetSpecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TweetSpecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
