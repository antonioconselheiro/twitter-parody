import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { NostrConverter, NPub, ProfileCache } from '@belomonte/nostr-ngx';
import { UrlUtil } from '@shared/util/url.service';
import { NoteHtmlfier } from './note-htmlfier.interface';
import { NoteResourcesContext } from '@view-model/context/note-resources-context.interface';

@Injectable({
  providedIn: 'root'
})
export class DefaultHtmlfier implements NoteHtmlfier {

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

    /**
     * extract links, images and videos from content 
     */
    extractMedia(content: string): NoteResourcesContext {
      const links = this.extractUrls(content);
      const isImageRegex = /\.(png|jpg|jpeg|gif|svg|webp)$|^data:/;
      const isVideoRegex = /\.(mp4)$/;
  
      const imageList = new Array<string>();
      const videoList = new Array<string>();
      const hyperlinks = new Array<string>();
  
      links.forEach(link => {
        const isImage = isImageRegex.test(link);
        const isVideo = isVideoRegex.test(link);
        if (isImage) {
          imageList.push(link);
        } else if (isVideo) {
          videoList.push(link);
        } else {
          hyperlinks.push(link);
        }
      });
  
      return {
        hyperlinks,
        imageList,
        videoList
      };
    }
  
    private extractUrls(content: string): string[] {
      const getUrlsRegex = /(\bhttps?:\/\/[^"\s]+\b)/g;
      const matches = content.match(getUrlsRegex);
      if (!matches || !matches.length) {
        return [];
      }
  
      return Array.from(matches);
    }

  //  FIXME: this code keeps in twitter parody and should be not include in core library
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
        const pubkey = this.nostrConverter.convertNPubToPubkey(npub);
        const resultset = this.profileCache.get(pubkey);
        let replace: string = npub;
        if (resultset && resultset.metadata) {
          replace = resultset.metadata.display_name || resultset.metadata.name || this.minifyNostrPublic(npub);
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
