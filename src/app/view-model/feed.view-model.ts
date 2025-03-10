import { Account, AccountRaw } from '@belomonte/nostr-ngx';
import { ViewModelGuard } from '@shared/view-model-mapper/view-model.guard';
import { EagerNoteViewModel } from './eager-note.view-model';
import { LazyNoteViewModel } from './lazy-note.view-model';
import { NostrViewModelSet } from './nostr-view-model.set';
import { ReactionViewModel } from './reaction.view-model';
import { ZapViewModel } from './zap.view-model';

export class FeedViewModel<AccountViewModel extends Account = Account> extends NostrViewModelSet<EagerNoteViewModel<AccountViewModel> | LazyNoteViewModel, AccountViewModel> {

  // eslint-disable-next-line complexity
  override add(viewModel: EagerNoteViewModel<AccountViewModel> | LazyNoteViewModel | ReactionViewModel | ZapViewModel): this {
    if (ViewModelGuard.isNoteViewModel(viewModel)) {
      if (viewModel.reply.replyTo) {
        const replyNote = this.get(viewModel.reply.replyTo.id);
        replyNote.reply.replies.add(viewModel);
        this.indexEvent(replyNote);
      } else {
        super.add(viewModel);
      }
    } else if (ViewModelGuard.isReactionViewModel(viewModel) || ViewModelGuard.isZapViewModel(viewModel)) {
      viewModel.reactedTo.forEach(note => {
        const reactions = this.get(note).reactions[viewModel.content] || new NostrViewModelSet<ReactionViewModel<AccountRaw>, AccountRaw>();
        reactions.add(viewModel);
      });
    }

    return this;
  }
}