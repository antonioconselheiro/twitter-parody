import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { TweetMediaContentViewModel } from '@shared/tweet-widget/tweet-content/tweet-media-content.view-model';
import { UrlUtil } from '@shared/util/url.service';

@Pipe({
  name: 'proxifyImage'
})
export class ProxifyImagePipe implements PipeTransform {

  private readonly safeOrigins = [
    'https://imgur.com/',
    'https://i.imgur.com/',
    'https://m.primal.net/',
    'https://nostr.build/'
  ];

  constructor(
    private urlUtil: UrlUtil
  ) {}

  transform(src: TweetMediaContentViewModel): SafeHtml {
    const isSecureOrigin = this.urlUtil.regexFromLinks(this.safeOrigins);
    if (!isSecureOrigin.test(src.value)) {
      //  FIXME: tornar proxy configurável pelo usuário
      return `https://imgproxy.iris.to/insecure/plain/${src.value}`;
    }

    return src.value;
  }

}
