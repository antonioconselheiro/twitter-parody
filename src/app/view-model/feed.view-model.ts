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

  /**
   * Index the event and associate each related event id in an eager note in
   * the object and, if no eager event is found a lazy event is created using
   * only the id and the relations will be registred on it
   */
  // eslint-disable-next-line complexity
  override indexEvent(viewModel: NoteViewModel): void {
    //  1. procura se a associação é relativa a um evento eager, se sim, associa
    //  2. se não, cria um evento lazy e associa
    //  3. se meu evento novo sendo indexado tem um lazy precedendo ele, ele deve substitui-lo e se associar aos outros eventos onde este lazy foi relacionado

    // SERÁ? Relacionar eventos desta maneira pode gerar muitos loops recorrentes
    //  Relacionar eventos desta maneira fará com que verificações de associação sejam feitas continuamente
    //  Alternativa tlvz ruim: E se o evento for uma coisa e as relações dele forem outra coisa? Como dois objetos?
    //  E se no evento houverem apenas os ids das relações e então o evento relacionado deve ser buscado no objeto de feed?
    //  E se o conversor de eventos nostr em view model retornar uma lista de view models? Incluindo os eventos lazy load mencionados? Eu preciso de eventos lazy load se não tenho pretensão de relacionar os eventos em objetos?

    if (viewModel.reply.replyTo) {
      const replyNote = this.get(viewModel.reply.replyTo.id);

      if (replyNote) {
        replyNote.reply.replies.add(viewModel);
        this.indexEvent(replyNote);
      }
    }

    if (viewModel.reply.rootRepling) {
      const rootReplyNote = this.get(viewModel.reply.rootRepling.id);

      if (rootReplyNote) {
        this.indexEvent(rootReplyNote);
      }
    }

    if (viewModel.reply.replies.size) {
      viewModel.reply.replies.forEach(replyNote => {
        replyNote.reply.replies.add(viewModel);
        this.indexEvent(replyNote);
      });
    }

    if (viewModel.reposting?.size) {
      viewModel.reposting.forEach(replyNote => {
        replyNote.reply.replies.add(viewModel);
        this.indexEvent(replyNote);
      });
    }

    if (viewModel.reactions) {

    }

    if (viewModel.zaps.size) {

    }

    if (viewModel.reposted.size) {

    }

    if (viewModel.mentioned.size) {

    }

    // TODO: TODOING: devo incluir aqui a lógica que irá associar os objetos de evento um com os outros, como respostas e talvez também reações
    //  quais propriedades são relacionadas? reactions, por exemplo
    //  preciso rodar uma verificação para identificar se outros eventos se relacionam com este?
    //  vou relacionar este evento com todos os disponíveis do feed, devo registrar em algum lugar caso não haja eventos disponível para associar?
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
      relates: [],
      createdAt: -Infinity
    };
  }
}