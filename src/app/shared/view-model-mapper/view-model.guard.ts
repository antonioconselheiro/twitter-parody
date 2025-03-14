import { Injectable } from "@angular/core";
import { EagerNoteViewModel } from "@view-model/eager-note.view-model";
import { LazyNoteViewModel } from "@view-model/lazy-note.view-model";
import { NostrEventViewModel } from "@view-model/nostr-event.view-model";
import { NoteViewModel } from "@view-model/note.view-model";
import { ReactionViewModel } from "@view-model/reaction.view-model";
import { RepostNoteViewModel } from "@view-model/repost-note.view-model";
import { ZapViewModel } from "@view-model/zap.view-model";
import { Reaction, Repost, ShortTextNote, Zap } from 'nostr-tools/kinds';

/**
 * Allow identify which type of view model is implemented
 */
@Injectable({
  providedIn: 'root'
})
export class ViewModelGuard {
  static isReactionViewModel(viewModel: NostrEventViewModel): viewModel is ReactionViewModel {
    return viewModel.event.kind === Reaction;
  }

  static isZapViewModel(viewModel: NostrEventViewModel): viewModel is ZapViewModel {
    return viewModel.event.kind === Zap;
  }

  static isRepostNoteViewModel(viewModel: NostrEventViewModel): viewModel is RepostNoteViewModel {
    return viewModel.event.kind === Repost;
  }

  static isEagerNoteViewModel(viewModel: NostrEventViewModel): viewModel is EagerNoteViewModel {
    return this.isNoteViewModel(viewModel) && viewModel.author.state !== 'raw';
  }

  static isNoteViewModel(viewModel: NostrEventViewModel): viewModel is NoteViewModel {
    return [Repost, ShortTextNote].includes(viewModel.event.kind);
  }

  static isLazyNoteViewModel(viewModel: NostrEventViewModel): viewModel is LazyNoteViewModel {
    return this.isNoteViewModel(viewModel) && viewModel.author.state === 'raw';
  }

  isReactionViewModel(viewModel: NostrEventViewModel): viewModel is ReactionViewModel {
    return ViewModelGuard.isReactionViewModel(viewModel);
  }

  isZapViewModel(viewModel: NostrEventViewModel): viewModel is ZapViewModel {
    return ViewModelGuard.isZapViewModel(viewModel);
  }

  isRepostNoteViewModel(viewModel: NostrEventViewModel): viewModel is RepostNoteViewModel {
    return ViewModelGuard.isRepostNoteViewModel(viewModel);
  }

  isEagerNoteViewModel(viewModel: NostrEventViewModel): viewModel is EagerNoteViewModel {
    return ViewModelGuard.isEagerNoteViewModel(viewModel);
  }

  isNoteViewModel(viewModel: NostrEventViewModel): viewModel is NoteViewModel {
    return ViewModelGuard.isNoteViewModel(viewModel);
  }

  isLazyNoteViewModel(viewModel: NostrEventViewModel): viewModel is LazyNoteViewModel {
    return ViewModelGuard.isLazyNoteViewModel(viewModel);
  }
}
