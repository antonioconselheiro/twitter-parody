import { HexString } from '@belomonte/nostr-ngx';
import { ViewModelGuard } from '@shared/view-model-mapper/view-model.guard';
import { LazyNoteViewModel } from './lazy-note.view-model';
import { NostrViewModelSet } from './nostr-view-model.set';
import { NoteViewModel } from './note.view-model';
import { ReactionViewModel } from './reaction.view-model';
import { RelatedContentViewModel } from './related-content.view-model';
import { ZapViewModel } from './zap.view-model';

export class FeedViewModel extends NostrViewModelSet<NoteViewModel, NoteViewModel | ReactionViewModel | ZapViewModel> {

  private readonly indexNotFound = -1;

  /**
   * add view model to the feed, if view model is a short text event or a repost, it will be set
   * as a main event of the feed, if your view model is a reply that relates to some main events
   * in the feed, but is not a main event, you should add it using indexEvent method
   */
  override add(viewModel: NoteViewModel | ReactionViewModel | ZapViewModel): this {
    if (ViewModelGuard.isReactionViewModel(viewModel)) {
      this.indexReaction(viewModel);
    } else if (ViewModelGuard.isZapViewModel(viewModel)) {
      this.indexZap(viewModel);
    } else if (ViewModelGuard.isNoteViewModel(viewModel)) {
      super.add(viewModel);
    }

    return this;
  }

  /**
   * Index the event and associate each related event id in an eager note in
   * the object and, if no eager event is found a lazy event is created using
   * only the id and the relations will be registred on it
   */
  override index(viewModel: NoteViewModel): RelatedContentViewModel<NoteViewModel>;
  override index(viewModel: ReactionViewModel): RelatedContentViewModel<ReactionViewModel>;
  override index(viewModel: ZapViewModel): RelatedContentViewModel<ZapViewModel>;
  override index(viewModel: NoteViewModel | ReactionViewModel | ZapViewModel): RelatedContentViewModel<NoteViewModel | ReactionViewModel | ZapViewModel>;
  override index(viewModel: NoteViewModel | ReactionViewModel | ZapViewModel): RelatedContentViewModel<NoteViewModel | ReactionViewModel | ZapViewModel> {
    const related = super.index(viewModel);
    if (ViewModelGuard.isReactionViewModel(viewModel)) {
      this.indexReaction(viewModel);
    } else if (ViewModelGuard.isZapViewModel(viewModel)) {
      this.indexZap(viewModel);
    } else if (ViewModelGuard.isNoteViewModel(viewModel)) {
      this.indexNote(viewModel);
    }

    return related;
  }

  private indexReaction(reaction: ReactionViewModel): void {
    reaction.reactedTo.forEach(idHex => {
      const relatedContent = this.get(idHex) || this.factoryRelatedContentFromHexadecimal(idHex);
      if (!relatedContent.reactions[reaction.content]) {
        relatedContent.reactions[reaction.content] = new Set();
      }

      relatedContent.reactions[reaction.content].add(reaction.id);
      relatedContent.reactionsAuthors.push(reaction.author.pubkey);
      this.indexed[relatedContent.viewModel.id] = relatedContent;
    });
  }

  private indexZap(zap: ZapViewModel): void {
    zap.reactedTo.forEach(idHex => {
      const relatedContent = this.get(idHex) || this.factoryRelatedContentFromHexadecimal(idHex);
      relatedContent.zaps.add(zap.id);
      relatedContent.zapAuthors.push(zap.author.pubkey);
      this.indexed[relatedContent.viewModel.id] = relatedContent;
    });
  }

  private indexNote(note: NoteViewModel): void {
    if (note.replingTo) {
      const relatedReplingTo = this.get(note.replingTo) || this.factoryRelatedContentFromHexadecimal(note.replingTo);
      relatedReplingTo.repliedBy.add(note.replingTo);
      relatedReplingTo.repliedByAuthors.push(note.author.pubkey);
      this.indexed[note.replingTo] = relatedReplingTo;
    }

    if (note.reposting) {
      note.reposting.forEach(repostedNote => {
        const relatedReposted = this.index(repostedNote);
        relatedReposted.reposted.add(note.id);
        relatedReposted.repostedAuthors.push(note.author.pubkey);
      });
    }
  }

  protected factoryLazyNote(idEvent: HexString): LazyNoteViewModel {
    return {
      id: idEvent,
      type: 'lazy',
      author: null,
      event: null,
      origin: [],
      media: [],
      content: undefined,
      location: undefined,
      relates: [],
      createdAt: -Infinity
    };
  }

  /**
   * check if event was reacted by some pubkey
   */
  hasReactedBy(idEvent: HexString, pubkey: HexString): boolean {
    const related = this.get(idEvent);
    if (related) {
      return related.reactionsAuthors.indexOf(pubkey) !== this.indexNotFound;
    }

    return false;
  }

  /**
   * check if event was reposted or mentioned by some pubkey
   */
  hasRepostedBy(idEvent: HexString, pubkey: HexString): boolean {
    const related = this.get(idEvent);
    if (related) {
      return related.repostedAuthors.indexOf(pubkey) !== this.indexNotFound;
    }

    return false;
  }

  /**
   * check if event was replied by some pubkey
   */
  hasRepliedBy(idEvent: HexString, pubkey: HexString): boolean {
    const related = this.get(idEvent);
    if (related) {
      return related.repliedByAuthors.indexOf(pubkey) !== this.indexNotFound;
    }

    return false;
  }
}