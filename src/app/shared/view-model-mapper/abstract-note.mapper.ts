import { NostrEvent, NostrGuard } from "@belomonte/nostr-ngx";
import { NoteReply } from "@view-model/context/note-reply.interface";
import { NoteViewModel } from "@view-model/note.view-model";
import { SortedNostrViewModelSet } from "@view-model/sorted-nostr-view-model.set";
import { Repost, ShortTextNote } from 'nostr-tools/kinds';
import { TagHelper } from "./tag.helper";

export abstract class AbstractNoteMapper {

  protected abstract tagHelper: TagHelper;
  protected abstract guard: NostrGuard;

  protected getReply(event: NostrEvent, relationedEvents: Array<NostrEvent>): NoteReply {
    const [rootRepling = undefined] = this.tagHelper.getRelatedEventsByRelationType(event, 'root');
    const [replyTo = undefined] = this.tagHelper.getRelatedEventsByRelationType(event, 'reply');
    const replies = relationedEvents.filter(event => {
      const replies = this.tagHelper.getRelatedEventsByRelationType(event, 'reply');
      return replies.find(reply => reply === event.id);
    });
    // TODO: TODOING: vou precisar refatorar isso aqui
    //  os replies devem ser agrupados como view models, mas as classes que criam os view models
    //  a partir de eventos estendem esta classe, ela não poderia ter esses serviços injetados.
    //  A questão é: como fazer com que este código seja compartilhado entre o repost.mapper e
    //  o simple-text.mapper sem que seja criada uma dependência circular?
    return {
      replyTo,
      rootRepling,
      replies,
    };
  }

  protected getRepostedBy(event: NostrEvent, relationedEvents: Array<NostrEvent>): SortedNostrViewModelSet<NoteViewModel> {
    return relationedEvents.filter(relatedEvent => {
      if (!this.guard.isKind(relatedEvent, [ShortTextNote, Repost])) {
        return false;
      }

      const replies = this.tagHelper.getRelatedEventsByRelationType(relatedEvent, 'mention');
      return replies.find(reply => reply === event.id);
    });
  }
}
