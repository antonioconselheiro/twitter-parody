import { ViewModelGuard } from '@shared/view-model-mapper/view-model.guard';
import { NostrViewModelSet } from './nostr-view-model.set';
import { NoteViewModel } from './note.view-model';
import { ReactionViewModel } from './reaction.view-model';
import { ZapViewModel } from './zap.view-model';
import { LazyNoteViewModel } from './lazy-note.view-model';
import { HexString } from '@belomonte/nostr-ngx';

export class FeedViewModel extends NostrViewModelSet<NoteViewModel> {

  /**
   * add view model to the feed, if view model is a short text event or a repost, it will be set
   * as a main event of the feed, if your view model is a reply that relates to some main events
   * in the feed, but is not a main event, you should add it using indexEvent method
   */
  override add(viewModel: NoteViewModel | ReactionViewModel | ZapViewModel): this {
    if (ViewModelGuard.isReactionViewModel(viewModel) || ViewModelGuard.isZapViewModel(viewModel)) {
      viewModel.reactedTo.forEach(noteHex => {
        const note = this.get(noteHex);

        if (note) {
          const reactions = note.reactions[viewModel.content] || new NostrViewModelSet<ReactionViewModel>();
          reactions.add(viewModel);
          note.reactions[viewModel.content] = reactions;
        } else {
          console.warn(`note ${note} not found in feed, reaction could not be associated `, viewModel);
        }
      });
    } else if (ViewModelGuard.isNoteViewModel(viewModel)) {
      super.add(viewModel);
    }

    return this;
  }

  override indexEvent(viewModel: NoteViewModel): void {
    if (viewModel.reply.replyTo) {
      const replyNote = this.get(viewModel.reply.replyTo.id);
      replyNote.reply.replies.add(viewModel);
      this.indexEvent(replyNote);
    }

    // TODO: TODING: devo incluir aqui a lógica que irá associar os objetos de evento um com os outros, como respostas e talvez também reações
    super.indexEvent(viewModel);
  }

  protected factoryLazyNote(idEvent: HexString): LazyNoteViewModel {
    return {
      id: idEvent,
      author: null,
      event: null,
      origin: [],
      content: undefined,
      media: undefined,
      location: undefined,

      reactions: {},
      zaps: new NostrViewModelSet<ZapViewModel>(),
      reposted: new NostrViewModelSet<NoteViewModel>(),
      mentioned: new NostrViewModelSet<NoteViewModel>(),
      reply: {
        replies: new NostrViewModelSet<NoteViewModel>()
      },

      createdAt: -Infinity
    };
  }
}