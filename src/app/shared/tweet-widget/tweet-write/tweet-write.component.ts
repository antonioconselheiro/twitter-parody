import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticatedProfileObservable, IProfile } from '@belomonte/nostr-credential-ngx';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-tweet-write',
  templateUrl: './tweet-write.component.html',
  styleUrls: ['./tweet-write.component.scss']
})
export class TweetWriteComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  tweet = '';
  profile: IProfile | null = null;
  
  constructor(
    private profile$: AuthenticatedProfileObservable
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(this.profile$.subscribe({
      next: profile => this.profile = profile 
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  includeEmoji(textArea: HTMLTextAreaElement, emoji: string): void {
    const currentValue = textArea.value,
      selectionStart = textArea.selectionStart,
      selectionEnd = textArea.selectionEnd;

    const start = currentValue.substring(0, selectionStart);
    const end = currentValue.substring(selectionEnd);

    this.tweet = `${start}${emoji || ''}${end}`;
  }
}
