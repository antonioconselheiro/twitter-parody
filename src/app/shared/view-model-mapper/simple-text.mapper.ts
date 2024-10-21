import { Inject, Injectable } from '@angular/core';
import { MAIN_NCACHE_TOKEN } from '@belomonte/nostr-ngx';
import { NCache, NostrEvent } from '@nostrify/nostrify';
import { DefaultHtmlfyService } from '@shared/htmlfy/default-htmlfy.service';
import { HTML_PARSER_TOKEN } from '@shared/htmlfy/html-parser.token';
import { RepostNoteViewModel } from '../../view-model/repost-note.view-model';
import { SimpleTextNoteViewModel } from '../../view-model/simple-text-note.view-model';
import { NoteResourcesContext } from '../../view-model/context/note-resources-context.interface';

@Injectable({
  providedIn: 'root'
})
export class SimpleTextMapper {

  constructor(
    @Inject(HTML_PARSER_TOKEN)  private htmlfyService: DefaultHtmlfyService,
    @Inject(MAIN_NCACHE_TOKEN) private ncache: NCache
  ) { }

  toViewModel(event: NostrEvent): SimpleTextNoteViewModel | RepostNoteViewModel {
    const content = event.content || '';
    const resources = this.extractReferencesFromContent(content);
  }

  private extractReferencesFromContent(content: string): NoteResourcesContext {
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
}
