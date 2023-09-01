import { Pipe, PipeTransform } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { UrlUtil } from '@shared/util/url.service';

@Pipe({
  name: 'proxifyImage'
})
export class ProxifyImagePipe implements PipeTransform {

  private readonly safeOrigins = [
    'https://imgur.com/',
    'https://i.imgur.com/',
    'https://imgproxy.iris.to/'
  ];

  constructor(
    private urlUtil: UrlUtil
  ) {}

  transform(src: string): SafeHtml {
    const isSecureOrigin = this.urlUtil.regexFromLinks(this.safeOrigins);
    if (!isSecureOrigin.test(src)) {
      return `https://imgproxy.iris.to/insecure/plain/${src}`;
    }

    return src;
  }

}
