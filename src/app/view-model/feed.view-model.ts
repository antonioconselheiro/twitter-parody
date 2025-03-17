import { ViewModelGuard } from '@shared/view-model-mapper/view-model.guard';
import { NostrViewModelSet } from './nostr-view-model.set';
import { NoteViewModel } from './note.view-model';
import { ReactionViewModel } from './reaction.view-model';
import { ZapViewModel } from './zap.view-model';

export class FeedViewModel extends NostrViewModelSet<NoteViewModel> {

  /**
   * add view model to the feed, if view model is a short text event or a repost, it will be set
   * as a main event of the feed, if your view model is a reply that relates to some main events
   * in the feed, but is not a main event, you should add it using indexEvent method
   */
  override add(viewModel: NoteViewModel | ReactionViewModel | ZapViewModel): this {
    if (ViewModelGuard.isNoteViewModel(viewModel)) {
      if (viewModel.reply.replyTo) {
        const replyNote = this.get(viewModel.reply.replyTo.id);
        replyNote.reply.replies.add(viewModel);
        this.indexEvent(replyNote);
      } else {
        super.add(viewModel);
      }
    } else if (ViewModelGuard.isReactionViewModel(viewModel) || ViewModelGuard.isZapViewModel(viewModel)) {
      viewModel.reactedTo.forEach(noteHex => {
        const note = this.get(noteHex);

        if (note) {
          const reactions = note.reactions[viewModel.content] || new NostrViewModelSet<ReactionViewModel>();
          reactions.add(viewModel);
          note.reactions[viewModel.content] = reactions;
        } else {
          console.warn(`note ${note} não encontrado no feed, reaction não pôde ser associada `, viewModel);
        }
      });
    }

    return this;
  }

  override indexEvent(value: NoteViewModel): void {
    // TODO: TODING: devo incluir aqui a lógica que irá associar os objetos de evento um com os outros, como respostas e talvez também reações
    super.indexEvent(value);
  }
}