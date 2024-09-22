import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { NostrConverter, NPub, ProfileCache } from '@belomonte/nostr-ngx';
import { UrlUtil } from '@shared/util/url.service';

@Injectable({
  providedIn: 'root'
})
export class HtmlfyService {

  constructor(
    private urlUtil: UrlUtil,
    private nostrConverter: NostrConverter,
    private profileCache: ProfileCache
  ) { }

  safify(content: string): SafeHtml {
    content = this.stripTags(content);
    const { urls, imageList, videoUrl } = this.separateImageAndLinks(content);
    content = this.htmlfyLink(content, urls);
    content = this.htmlfyHashtag(content);
    content = this.htmlfyMention(content);
    content = this.htmlfyParagraph(content);
    const midiaMetadata = [videoUrl].concat(imageList).filter((has): has is string => !!has);
    content = this.stripMetadata(content, midiaMetadata);

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
    content = content
      .replace(/nostr:npub(\w+)/g, "<a class='mention' href='/p/npub$1'>{{npub$1}}</a>");
    const matches = content.match(/(\{\{npub[^ ]*\}\})/g);

    if (matches) {
      [...matches].forEach(match => {
        const npub = match.replace(/^\{\{|\}\}/g, '') as NPub;
        const pubkey = this.nostrConverter.casNPubToPubkey(npub);
        const profile = this.profileCache.get(pubkey);
        let replace: string = npub;
        if (profile) {
          replace = profile.display_name || profile.name || this.minifyNostrPublic(npub);
        }

        content = content.replace(new RegExp(match, 'g'), replace)
      });
    }

    return content;
  }

  private minifyNostrPublic(npub: NPub): string {
    return npub.replace(/(^.{7})(.+)(.{3}$)/g, '$1…$3');
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

  private stripMetadata(content: string, midiaMetadata: string[]): string {
    midiaMetadata.forEach(img => content = content.replace(this.urlUtil.regexFromLink(img), ''));
    const nostrMetadataMatcher = /nostr:[^ ]+/g; 
    content = content.replace(nostrMetadataMatcher, '');
    return content;
  }

  private regexFromLink(link: string): RegExp {
    return new RegExp(link.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')+'/?');
  }
}
