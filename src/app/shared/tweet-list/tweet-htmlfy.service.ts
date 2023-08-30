import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Injectable()
export class TweetHtmlfyService {

  private readonly safeOrigins = [
    'https://imgur.com/',
    'https://i.imgur.com/',
    'https://imgproxy.iris.to/',
  ];

  safify(content: string): SafeHtml {
    content = this.stripTags(content);
    content = this.proxifyImage(content);
    content = this.htmlfyHashtag(content);
    content = this.htmlfyLink(content);

    return content;
  }

  private proxifyImage(content: string): string {
    const secureImageMatch = this.regexForSecureImage();
    const enimagified = `<img src="$1" />`;

    const otherImageMatch = /(\shttps?\:\/\/([^ ])+\.(png|jpg|jpeg|gif|svg|webp)\s)/g;
    const enproxified = `<img src="https://imgproxy.iris.to/insecure/plain/$1" />`;
  
    return content.replace(
      secureImageMatch, enimagified
    ).replace(
      otherImageMatch, enproxified
    );
  }

  private regexForSecureImage(): RegExp {
    const safes = this.safeOrigins.join('|');
    debugger;
    return new RegExp(
      `(\s(${safes})[^ ]+\\.(png|jpg|jpeg|gif|svg|webp)\s)|\sdata:image([^ ])+\s`, 'g'
    );
  }

  private stripTags(content: string | string): string {
    return content
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace('"', '&#38;')
      .replace("'", '&#39;');
  }

  private htmlfyHashtag(content: string | string): string {
    return content.replace(/(#[^ ]+)/g, "<a href='#/explore?q=$1'>$1</a>");
  }

  //  run proxifyImage before 
  private htmlfyLink(content: string | string): string {
    const linkMath = /(\shttps?\:\/\/([^ ])+\s)/g;
    const ahrefify = `<a target="_BLANK" href="$1">$1</a>`;

    return content.replace(linkMath, ahrefify);
  }
}
