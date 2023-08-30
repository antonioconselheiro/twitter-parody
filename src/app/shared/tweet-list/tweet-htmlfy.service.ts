import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Injectable()
export class TweetHtmlfyService {

  private readonly safeOrigins = [
    'https://imgur.com/',
    'https://i.imgur.com/',
    'https://imgproxy.iris.to/'
  ];

  safify(content: string): SafeHtml {
    content = this.stripTags(content);
    const urls = this.extractUrls(content);
    const wrapper = this.proxifyImage(content, urls);
    content = wrapper.content;
    content = this.htmlfyLink(content, urls);
    content = this.htmlfyHashtag(content);
    content = this.htmlfyMention(content);
    content = this.htmlfyParagraph(content);

    return `${content}<figure>${wrapper.imgs.join('')}</figure>`;
  }

  private extractUrls(content: string): string[] {
    const getUrlsRegex = /(\bhttps?\:\/\/[^"\s]+\b)/g;
    const matches = content.match(getUrlsRegex);
    if (!matches || !matches.length) {
      return [];
    }

    return Array.from(matches);
  }

  //  changes array
  private filterImageLinksFromLinks(links: string[]): string[] {
    const isImgRegex = /\.(png|jpg|jpeg|gif|svg|webp)$/;
    const imgsIndex: number[] = [];
    const imgLinks = links.filter((link, index) => {
      const is = isImgRegex.test(link);
      if (is) {
        imgsIndex.push(index);
        return true;
      }

      return false;
    });

    imgLinks.forEach(imgLink => {
      links.splice(links.indexOf(imgLink), 1);
    });

    return imgLinks;
  }

  private proxifyImage(content: string, links: string[]): { content: string, imgs: string[] } {
    const imgs: string[] = [];
    const imgLinks = this.filterImageLinksFromLinks(links);
    const isSecureOrigin = new RegExp(`^(${this.safeOrigins.join('|')})`);
    imgLinks.forEach(imgSrc => {
      const imgSrcRegex = this.regexFromLink(imgSrc);
      if (isSecureOrigin.test(imgSrc)) {
        content = content.replace(imgSrcRegex, '');
        imgs.push(`<img src="${imgSrc}" />`);
      } else {
        content = content.replace(imgSrcRegex, '');
        imgs.push(`<img src="https://imgproxy.iris.to/insecure/plain/${imgSrc}" />`);
      }
    });

    return { content,imgs };
  }

  private htmlfyLink(content: string, links: string[]): string {
    links.forEach(link => {
      const linkRegex = this.regexFromLink(link);
      content = content.replace(linkRegex, `<a class='raw-link' target="_BLANK" href="${link}">${link}</a>`);
    });

    return content;
  }

  private stripTags(content: string): string {
    return content
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace('"', '&#38;')
      .replace("'", '&#39;');
  }

  private htmlfyMention(content: string): string {
    return content.replace(/nostr:npub(\w+)/g, "<a class='mention' href='/npub$1'>npub$1</a>");
  }

  private htmlfyHashtag(content: string): string {
    return content.replace(/#(\w+)/g, "<a class='hashtag' href='#/explore?q=$1'>$1</a>");
  }

  private htmlfyParagraph(content: string): string {
    const multipleBreakLineRegex = /[\n\r]+/g;
    return content
      .replace(multipleBreakLineRegex, '\n')
      .split('\n')
      .filter(has => !!has.trim())
      .map(p => `<p>${p}</p>`)
      .join('');
  }

  private regexFromLink(link: string): RegExp {
    return new RegExp(link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  }
}
