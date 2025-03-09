import { Injectable } from "@angular/core";
import { Account } from "@belomonte/nostr-ngx";
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
  static isReactionViewModel<AccountViewModel extends Account>(viewModel: NostrEventViewModel<AccountViewModel>): viewModel is ReactionViewModel<AccountViewModel> {
    return viewModel.event.kind === Reaction;
  }

  static isZapViewModel<AccountViewModel extends Account>(viewModel: NostrEventViewModel<AccountViewModel>): viewModel is ZapViewModel<AccountViewModel> {
    return viewModel.event.kind === Zap;
  }

  static isRepostNoteViewModel<AccountViewModel extends Account>(viewModel: NostrEventViewModel<AccountViewModel>): viewModel is RepostNoteViewModel<AccountViewModel> {
    return viewModel.event.kind === Repost;
  }

  static isEagerNoteViewModel<AccountViewModel extends Account>(viewModel: NostrEventViewModel<AccountViewModel>): viewModel is EagerNoteViewModel<AccountViewModel> {
    return this.isNoteViewModel(viewModel) && viewModel.author.state !== 'raw';
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isNoteViewModel(viewModel: NostrEventViewModel<any>): viewModel is NoteViewModel<any> {
    return [Repost, ShortTextNote].includes(viewModel.event.kind);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static isLazyNoteViewModel(viewModel: NostrEventViewModel<any>): viewModel is LazyNoteViewModel {
    return this.isNoteViewModel(viewModel) && viewModel.author.state === 'raw';
  }

  isReactionViewModel<AccountViewModel extends Account>(viewModel: NostrEventViewModel<AccountViewModel>): viewModel is ReactionViewModel<AccountViewModel> {
    return ViewModelGuard.isReactionViewModel(viewModel);
  }

  isZapViewModel<AccountViewModel extends Account>(viewModel: NostrEventViewModel<AccountViewModel>): viewModel is ZapViewModel<AccountViewModel> {
    return ViewModelGuard.isZapViewModel(viewModel);
  }

  isRepostNoteViewModel<AccountViewModel extends Account>(viewModel: NostrEventViewModel<AccountViewModel>): viewModel is RepostNoteViewModel<AccountViewModel> {
    return ViewModelGuard.isRepostNoteViewModel(viewModel);
  }

  isEagerNoteViewModel<AccountViewModel extends Account>(viewModel: NostrEventViewModel<AccountViewModel>): viewModel is EagerNoteViewModel<AccountViewModel> {
    return ViewModelGuard.isEagerNoteViewModel(viewModel);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isNoteViewModel(viewModel: NostrEventViewModel<any>): viewModel is NoteViewModel<any> {
    return ViewModelGuard.isNoteViewModel(viewModel);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isLazyNoteViewModel(viewModel: NostrEventViewModel<any>): viewModel is LazyNoteViewModel {
    return ViewModelGuard.isLazyNoteViewModel(viewModel);
  }
}
