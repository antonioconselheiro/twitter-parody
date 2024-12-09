import { NostrEvent, NostrGuard } from "@belomonte/nostr-ngx";
import { NoteReply } from "@view-model/context/note-reply.interface";
import { Repost, ShortTextNote } from 'nostr-tools/kinds';
import { TagHelper } from "./tag.helper";

export abstract class AbstractNoteMapper {

  protected abstract tagHelper: TagHelper;
  protected abstract guard: NostrGuard;

  protected getReplyContext(event: NostrEvent, relationedEvents: Array<NostrEvent>): NoteReply {
    const [rootRepling = undefined] = this.tagHelper.getRelatedEventsByRelationType(event, 'root');
    const [replyTo = undefined] = this.tagHelper.getRelatedEventsByRelationType(event, 'reply');
    const replies = relationedEvents.filter(event => {
      const replies = this.tagHelper.getRelatedEventsByRelationType(event, 'reply');
      return replies.find(reply => reply === event.id);
    });

    return {
      replyTo,
      rootRepling,
      replied: replies.map(reply => reply.id),
    };
  }

  protected getRepostedBy(event: NostrEvent, relationedEvents: Array<NostrEvent>): Array<string> {
    return relationedEvents.filter(relatedEvent => {
      if (!this.guard.isKind(relatedEvent, [ShortTextNote, Repost])) {
        return false;
      }

      const replies = this.tagHelper.getRelatedEventsByRelationType(relatedEvent, 'mention');
      return replies.find(reply => reply === event.id);
    }).map(event => event.id);
  }
}
