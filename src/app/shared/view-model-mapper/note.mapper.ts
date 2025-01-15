import { Inject, Injectable } from "@angular/core";
import { InMemoryNCache, LOCAL_CACHE_TOKEN, NostrEvent, NostrGuard } from "@belomonte/nostr-ngx";
import { NoteReplyContext } from "@view-model/context/note-reply-context.interface";
import { NoteViewModel } from "@view-model/note.view-model";
import { SortedNostrViewModelSet } from "@view-model/sorted-nostr-view-model.set";
import { Repost, ShortTextNote } from 'nostr-tools/kinds';
import { RepostMapper } from "./repost.mapper";
import { SimpleTextMapper } from "./simple-text.mapper";
import { TagHelper } from "./tag.helper";

@Injectable()
export class NoteMapper {

  constructor(
    @Inject(LOCAL_CACHE_TOKEN) private ncache: InMemoryNCache,
    private simpleTextMapper: SimpleTextMapper,
    private repostMapper: RepostMapper,
    private tagHelper: TagHelper,
    private guard: NostrGuard
  ) { }

  toViewModel(event: NostrEvent<Repost>): NoteViewModel;
  toViewModel(event: NostrEvent<ShortTextNote>): NoteViewModel;
  toViewModel(event: NostrEvent<ShortTextNote | Repost>): NoteViewModel;
  toViewModel(event: NostrEvent<ShortTextNote | Repost>): NoteViewModel {
    let note: NoteViewModel;
    if (this.guard.isKind(event, ShortTextNote)) {
      note = this.simpleTextMapper.toViewModel(event);
    } else {
      note = this.repostMapper.toViewModel(event);
    }

    return this.patchReplies(note);
  }

  private patchReplies(note: NoteViewModel): NoteViewModel {
    const events = this.ncache.syncQuery([
      {
        kinds: [
          ShortTextNote,
          Repost
        ],
        '#e': [
          note.event.id
        ]
      }
    ]);

    this.getReply(note, events);
    this.getRepostedBy(note, events);

    return note;
  }

  private getReply(note: NoteViewModel, relationedEvents: Array<NostrEvent>): NoteReplyContext {
    const [rootReplingId = undefined] = this.tagHelper.getRelatedEventsByRelationType(note.event, 'root');
    const [replyToId = undefined] = this.tagHelper.getRelatedEventsByRelationType(note.event, 'reply');
    const repliesEvents = relationedEvents.filter(event => {
      const replies = this.tagHelper.getRelatedEventsByRelationType(event, 'reply');
      return replies.find(reply => reply === note.event.id);
    });

    const replies = note.reply.replies;
    const rootRepling = this.fillRootRepling(rootReplingId);
    const replyTo = this.fillReplyTo(replyToId);
    this.fillReplies(replies, repliesEvents);

    return {
      replyTo,
      rootRepling,
      replies,
    };
  }

  private fillRootRepling(rootReplingId: string | undefined): NoteViewModel | undefined {
    if (rootReplingId) {
      const rootReplingEvent = this.ncache.get(rootReplingId);
      if (rootReplingEvent) {
        if (this.guard.isKind(rootReplingEvent, [ShortTextNote, Repost])) {
          return this.toViewModel(rootReplingEvent);
        }
      } else {
        // TODO: preciso inventar algo para esta situação, um objeto de evento não carregado
      }
    }

    return undefined;
  }

  private fillReplyTo(replyToId: string | undefined): NoteViewModel | undefined {
    if (replyToId) {
      const replyEvent = this.ncache.get(replyToId);
      if (replyEvent) {
        if (this.guard.isKind(replyEvent, [ShortTextNote, Repost])) {
          return this.toViewModel(replyEvent);
        }
      } else {
        // TODO: preciso inventar algo para esta situação, um objeto de evento não carregado
      }
    }

    return undefined;
  }

  private fillReplies(replies: SortedNostrViewModelSet<NoteViewModel>, repliesEvents: Array<NostrEvent>): void {
    for (const event of repliesEvents) {
      if (this.guard.isKind(event, [ShortTextNote, Repost])) {
        const note = this.toViewModel(event);
        replies.add(note);
      }
    }
  }

  private getRepostedBy(note: NoteViewModel, relationedEvents: Array<NostrEvent>): SortedNostrViewModelSet<NoteViewModel> {
    for (const event of relationedEvents) {
      if (!this.guard.isKind(event, [ShortTextNote, Repost])) {
        continue;
      }

      const mentions = this.tagHelper.getRelatedEventsByRelationType(event, 'mention');
      const contains = mentions.find(mention => mention === note.event.id);
      if (contains) {
        const mentioner = this.toViewModel(event);
        note.reposted.add(mentioner);
      }
    }

    return note.reposted;
  }
}
