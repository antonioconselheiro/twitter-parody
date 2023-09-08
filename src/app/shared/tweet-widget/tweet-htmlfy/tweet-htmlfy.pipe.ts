import { Pipe, PipeTransform } from '@angular/core';
import { TweetHtmlfyService } from './tweet-htmlfy.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'tweetHtmlfy'
})
export class TweetHtmlfyPipe implements PipeTransform {

  constructor(
    private service: TweetHtmlfyService,
    private sanitized: DomSanitizer
  ) {}

  transform(value: string | undefined): SafeHtml {
    const secureHtml = this.service.safify(value || '');
    return this.sanitized.bypassSecurityTrustHtml(secureHtml);
  }

}
