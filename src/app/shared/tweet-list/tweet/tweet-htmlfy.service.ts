import { Injectable } from '@angular/core';

@Injectable()
export class TweetHtmlfyService {

  safify(content: string): string {
    content = this.stripTags(content);
    const { urls } = this.separateImageAndLinks(content);
    content = this.htmlfyLink(content, urls);
    content = this.htmlfyHashtag(content);
    content = this.htmlfyMention(content);
    content = this.htmlfyParagraph(content);

    return content;
  }

  private extractUrls(content: string): string[] {
    const getUrlsRegex = /(\bhttps?\:\/\/[^"\s]+\b)/g;
    const matches = content.match(getUrlsRegex);
    if (!matches || !matches.length) {
      return [];
    }

    return Array.from(matches);
  }

  separateImageAndLinks(content: string): { urls: string[], imgs: string[] } {
    const links = this.extractUrls(content);
    const isImgRegex = /\.(png|jpg|jpeg|gif|svg|webp)$/;
    const imgs = new Array<string>();
    const urls = new Array<string>();
    links.forEach(link => {
      const is = isImgRegex.test(link);
      if (is) {
        imgs.push(link);
      } else {
        urls.push(link);
      }
    });

    return { urls, imgs };
  }

  private htmlfyLink(content: string, links: string[]): string {
    links.forEach(link => {
      const linkRegex = this.regexFromLink(link);
      content = content.replace(linkRegex, `<a class="raw-link" target="_BLANK" title="${link}" href="${link}">${link}</a>`);
    });

    return content;
  }

  private stripTags(content: string): string {
    return content
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  private htmlfyMention(content: string): string {
    return content.replace(/nostr:npub(\w+)/g, "<a class='mention' href='/npub$1'>npub$1</a>");
  }

  private htmlfyHashtag(content: string): string {
    return content.replace(/#(\w+)/g, "<a class='hashtag' href='#/explore?q=$1'>#$1</a>");
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
