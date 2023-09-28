import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ProfileCache } from '@shared/profile-service/profile.cache';

@Injectable({
  providedIn: 'root'
})
export class HtmlfyService {

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
    imageList: string[],
    videoUrl?: string
  } {
    const links = this.extractUrls(content);
    const isImageRegex = /\.(png|jpg|jpeg|gif|svg|webp)$/;
    const isVideoRegex = /\.(mp4)$/;

    const imageList = new Array<string>();
    let videoUrl: string | undefined = undefined;
    const urls = new Array<string>();

    links.forEach(link => {
      const isImage = isImageRegex.test(link);
      const isVideo = isVideoRegex.test(link);
      if (isImage) {
        imageList.push(link);
      } else if (isVideo) {
        videoUrl = link;
      } else {
        urls.push(link);
      }
    });

    return {
      urls,
      imgMatriz: this.imageListToMatriz(imageList),
      imageList,
      videoUrl
    };
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
    content = content
      .replace(/nostr:npub(\w+)/g, "<a class='mention' href='/p/npub$1'>{{npub$1}}</a>");
    const matches = content.match(/(\{\{npub[^ ]*\}\})/g);

    if (matches) {
      [...matches].forEach(match => {
        const npub = match.replace(/^\{\{|\}\}/g, '');
        const profile = ProfileCache.profiles[npub];
        let replace = npub;
        if (profile) {
          replace = profile.display_name || profile.name || npub;
        }

        content = content.replace(new RegExp(match, 'g'), replace)
      });
    }

    return content;
  }

  private htmlfyHashtag(content: string): string {
    return content.replace(/#(\w+)/g, "<a class='hashtag' href='/explore?q=$1'>#$1</a>");
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
