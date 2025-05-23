import { Inject, Injectable } from '@angular/core';
import { NOSTR_CACHE_TOKEN, NostrCache, NostrEvent, NostrGuard } from '@belomonte/nostr-ngx';
import { NoteReplyContext } from '@view-model/context/note-reply-context.interface';
import { NostrViewModelSet } from '@view-model/nostr-view-model.set';
import { NoteViewModel } from '@view-model/note.view-model';
import { Repost, ShortTextNote } from 'nostr-tools/kinds';
import { RepostMapper } from './repost.mapper';
import { SimpleTextMapper } from './simple-text.mapper';
import { TagHelper } from './tag.helper';

@Injectable()
export class NoteMapper {

  constructor(
    @Inject(NOSTR_CACHE_TOKEN) private nostrCache: NostrCache,
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
    const events = this.nostrCache.syncQuery([
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
    this.getMentionedBy(note, events);

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
      replingTo: replyTo,
      rootRepling,
      repliedBy: replies,
    };
  }

  private fillRootRepling(rootReplingId: string | undefined): NoteViewModel | undefined {
    if (rootReplingId) {
      const rootReplingEvent = this.nostrCache.get(rootReplingId);
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
      const replyEvent = this.nostrCache.get(replyToId);
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

  private fillReplies(replies: NostrViewModelSet<NoteViewModel>, repliesEvents: Array<NostrEvent>): void {
    for (const event of repliesEvents) {
      if (this.guard.isKind(event, [ShortTextNote, Repost])) {
        const note = this.toViewModel(event);
        replies.add(note);
      }
    }
  }

  private getMentionedBy(note: NoteViewModel, relationedEvents: Array<NostrEvent>): NostrViewModelSet<NoteViewModel> {
    for (const event of relationedEvents) {
      if (!this.guard.isKind(event, [ShortTextNote, Repost])) {
        continue;
      }

      //  FIXME: se houver somente um mention e o content do evento representar um nostr uri integralmente, então
      //  o mention deve ser considerado um repost simples
      const mentions = this.tagHelper.getRelatedEventsByRelationType(event, 'mention');
      const contains = mentions.find(mention => mention === note.event.id);
      if (contains) {
        const mentioner = this.toViewModel(event);
        note.mentioned.add(mentioner);
      }
    }

    return note.mentioned;
  }
}
