import { Pipe, PipeTransform } from '@angular/core';
import { TweetHtmlfyService } from './tweet-htmlfy.service';
import { SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'tweetHtmlfy'
})
export class TweetHtmlfyPipe implements PipeTransform {

  constructor(
    private service: TweetHtmlfyService
  ) {}

  transform(value: string): SafeHtml {
    return this.service.safify(value);
  }

}
