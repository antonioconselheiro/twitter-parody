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

  async toViewModel(event: NostrEvent<Repost>): Promise<NoteViewModel>;
  async toViewModel(event: NostrEvent<ShortTextNote>): Promise<NoteViewModel>;
  async toViewModel(event: NostrEvent<ShortTextNote | Repost>): Promise<NoteViewModel>;
  async toViewModel(event: NostrEvent<ShortTextNote | Repost>): Promise<NoteViewModel> {
    let note: NoteViewModel;
    if (this.guard.isKind(event, ShortTextNote)) {
      note = await this.simpleTextMapper.toViewModel(event);
    } else {
      note = await this.repostMapper.toViewModel(event);
    }

    return this.patchReplies(note);
  }

  private async patchReplies(note: NoteViewModel): Promise<NoteViewModel> {
    const events = await this.ncache.query([
      {
        kinds: [
          ShortTextNote,
          Repost
        ],
        '#e': [
          note.origin.id
        ]
      }
    ]);

    await this.getReply(note, events);
    await this.getRepostedBy(note, events);

    return note;
  }

  // eslint-disable-next-line complexity
  private async getReply(note: NoteViewModel, relationedEvents: Array<NostrEvent>): Promise<NoteReplyContext> {
    const [rootReplingId = undefined] = this.tagHelper.getRelatedEventsByRelationType(note.origin, 'root');
    const [replyToId = undefined] = this.tagHelper.getRelatedEventsByRelationType(note.origin, 'reply');
    const repliesEvents = relationedEvents.filter(event => {
      const replies = this.tagHelper.getRelatedEventsByRelationType(event, 'reply');
      return replies.find(reply => reply === note.origin.id);
    });

    const replies = note.reply.replies;
    const rootRepling = await this.fillRootRepling(rootReplingId);
    const replyTo = await this.fillReplyTo(replyToId);
    await this.fillReplies(replies, repliesEvents);

    return {
      replyTo,
      rootRepling,
      replies,
    };
  }

  private async fillRootRepling(rootReplingId: string | undefined): Promise<NoteViewModel | undefined> {
    if (rootReplingId) {
      const rootReplingEvent = await this.ncache.get(rootReplingId);
      if (rootReplingEvent) {
        if (this.guard.isKind(rootReplingEvent, [ShortTextNote, Repost])) {
          return this.toViewModel(rootReplingEvent);
        }
      } else {
        // TODO: preciso inventar algo para esta situação, um objeto de evento não carregado
      }
    }

    return Promise.resolve(undefined);
  }

  private async fillReplyTo(replyToId: string | undefined): Promise<NoteViewModel | undefined> {
    if (replyToId) {
      const replyEvent = await this.ncache.get(replyToId);
      if (replyEvent) {
        if (this.guard.isKind(replyEvent, [ShortTextNote, Repost])) {
          return this.toViewModel(replyEvent);
        }
      } else {
        // TODO: preciso inventar algo para esta situação, um objeto de evento não carregado
      }
    }

    return Promise.resolve(undefined);
  }

  private async fillReplies(replies: SortedNostrViewModelSet<NoteViewModel>, repliesEvents: Array<NostrEvent>): Promise<void> {
    for await (const event of repliesEvents) {
      if (this.guard.isKind(event, [ShortTextNote, Repost])) {
        const note = await this.toViewModel(event);
        replies.add(note);
      }
    }
  }

  private async getRepostedBy(note: NoteViewModel, relationedEvents: Array<NostrEvent>): Promise<SortedNostrViewModelSet<NoteViewModel>> {
    for await (const event of relationedEvents) {
      if (!this.guard.isKind(event, [ShortTextNote, Repost])) {
        continue;
      }

      const mentions = this.tagHelper.getRelatedEventsByRelationType(event, 'mention');
      const contains = mentions.find(mention => mention === note.origin.id);
      if (contains) {
        const mentioner = await this.toViewModel(event);
        note.reposted.add(mentioner);
      }
    }

    return Promise.resolve(note.reposted);
  }
}
