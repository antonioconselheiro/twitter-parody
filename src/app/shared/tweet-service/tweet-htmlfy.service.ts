import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Injectable()
export class TweetHtmlfyService {

  safify(content: string): SafeHtml {
    content = this.stripTags(content);
    const { urls } = this.separateImageAndLinks(content);
    content = this.htmlfyLink(content, urls);
    content = this.htmlfyHashtag(content);
    content = this.htmlfyMention(content);
    content = this.htmlfyParagraph(content);

    return content;
  }

  private extractUrls(content: string): string[] {
    const getUrlsRegex = /(\bhttps?:\/\/[^"\s]+\b)/g;
    const matches = content.match(getUrlsRegex);
    if (!matches || !matches.length) {
      return [];
    }

    return Array.from(matches);
  }

  separateImageAndLinks(content: string): {
    urls: string[],
    imgMatriz: [string, string?][],
    imgList: string[]
  } {
    const links = this.extractUrls(content);
    const isImgRegex = /\.(png|jpg|jpeg|gif|svg|webp)$/;
    let imgs = new Array<string>();
    const urls = new Array<string>();
    links.forEach(link => {
      const is = isImgRegex.test(link);
      if (is) {
        imgs.push(link);
      } else {
        urls.push(link);
      }
    });

    imgs = imgs.concat([
      'https://i.imgur.com/OjAomOO.jpeg',
      'https://i.imgur.com/OjAomOO.jpeg'
    ]);

    return { urls, imgMatriz: this.imageListToMatriz(imgs), imgList: imgs };
  }

  private imageListToMatriz(imgList: string[]): [string, string?][] {
    const pair = 2;

    if (imgList.length === pair) {
      return [[imgList[0]],[imgList[1]]];
    }

    let matriz: [string, string?][] = [];
    let currentTouple: [string, string?] | null = null;
    for (let i = imgList.length - 1; i >= 0; i--) {
      if (!currentTouple || currentTouple.length === pair) {
        currentTouple = [imgList[i]];
        matriz = [currentTouple].concat(matriz);
      } else {
        currentTouple.push(imgList[i]);
      }
    }

    return matriz;
  }

  private htmlfyLink(content: string, links: string[]): string {
    links.forEach(link => {
      const linkRegex = this.regexFromLink(link);
      content = content.replace(linkRegex, `<a class="raw" target="_BLANK" title="${link}" href="${link}">${link}</a>`);
    });

    return content;
  }

  private stripTags(content: string): string {
    return content
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  private htmlfyMention(content: string): string {
    return content.replace(/nostr:npub(\w+)/g, "<a class='mention' href='/p/npub$1'>npub$1</a>");
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
    return new RegExp(link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')+'/?');
  }
}
