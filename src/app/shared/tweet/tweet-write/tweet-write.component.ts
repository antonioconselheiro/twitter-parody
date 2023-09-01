import { Component } from '@angular/core';

@Component({
  selector: 'tw-tweet-write',
  templateUrl: './tweet-write.component.html',
  styleUrls: ['./tweet-write.component.scss']
})
export class TweetWriteComponent {

  tweet = '';

  includeEmoji(textArea: HTMLTextAreaElement, emoji: string): void {
    const currentValue = textArea.value,
      selectionStart = textArea.selectionStart,
      selectionEnd = textArea.selectionEnd;

    const start = currentValue.substring(0, selectionStart);
    const end = currentValue.substring(selectionEnd);

    this.tweet = `${start}${emoji || ''}${end}`;
  }
}
