import { ViewModelGuard } from '@shared/view-model-mapper/view-model.guard';
import { NostrViewModelSet } from './nostr-view-model.set';
import { NoteViewModel } from './note.view-model';
import { ReactionViewModel } from './reaction.view-model';
import { ZapViewModel } from './zap.view-model';

export class FeedViewModel extends NostrViewModelSet<NoteViewModel> {

  // eslint-disable-next-line complexity
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
        } else {
          console.warn(`note ${note} não encontrado no feed, reaction não pôde ser associada `, viewModel);
        }
      });
    }

    return this;
  }
}