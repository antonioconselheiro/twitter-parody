import { Inject, Injectable } from '@angular/core';
import { HexString, NOSTR_CACHE_TOKEN, NostrCache, NostrEvent, NostrGuard, ProfileProxy } from '@belomonte/nostr-ngx';
import { HTML_PARSER_TOKEN } from '@shared/htmlfier/html-parser.token';
import { NoteHtmlfier } from '@shared/htmlfier/note-htmlfier.interface';
import { EagerNoteViewModel } from '@view-model/eager-note.view-model';
import { LazyNoteViewModel } from '@view-model/lazy-note.view-model';
import { NostrViewModelSet } from '@view-model/nostr-view-model.set';
import { RepostNoteViewModel } from '@view-model/repost-note.view-model';
import { Repost, ShortTextNote } from 'nostr-tools/kinds';
import { ReactionMapper } from './reaction.mapper';
import { SimpleTextMapper } from './simple-text.mapper';
import { SingleViewModelMapper } from './single-view-model.mapper';
import { TagHelper } from './tag.helper';
import { ZapMapper } from './zap.mapper';

/**
 * 1. A consulta de timeline do usuário representará uma consulta de todos os eventos assinados por
 * ele dentro do limite de uma página, segundo a configuração de página da aplicação/usuário;
 *
 * 2. Havendo-se recebido um resultset de consulta, um feed, podendo represetar a timeline de um
 * usuário ou um outro tipo de filtro de eventos, um método identificar nestes dados quais são os
 * eventos que serão efetivamente exibidos em tela, neste ponto algumas regras deve ser consideradas:
 *  - o repost, isto é, um evento que recompartilha apenas um outro evento, sem adição de comentário
 * do autor, terá o evento que compartilha como principal a ser consultados dados complementares, como
 * o evento que será exibido em tela;
 *  - 
 *
 * 3. Observando as regras de 2, podemos pensar em algumas soluções para organizar as lógicas que
 * serão necessárias:
 *  - Deve-se identificar os eventos principais de feed antes deles serem repassados individualmente
 * para o mapper de view model?
 *  - O evento que representa o compartilhamento de outro evento que será exibido em tela deve ser
 * tratado como evento que agrega informações ao feed, identificado quem recompartilhou aquela
 * nota principal que será exibida no feed;
 *  - No retorno do método deverá retornar uma lista contendo eventos carregados ou uma string
 * hexadecimal representado o id dos eventos não carregados.
 *
 * 4. Será necessário criar uma representação de um evento que não foi carregado.
 *
 * Pergunta:
 * Deve-se considerar os seguintes cenários: ocorre dentro de uma timeline um evento que foi
 * compartilhado e o mesmo evento mencionado com comentário, como evitar que a lógica de conversão em
 * view model seja reexecutada?
 *
 * Se ocorre o carregamento de um evento que já foi carregado anteriormente, como evitar que a lógica
 * de conversão em view model seja reexecutada? Pergunto isso pois atualmente eu converto duas vezes e
 * depois mergeio os dois view models com uma lógica grotesca.
 *
 * Resposta: deve haver uma espécie de cache de referência da qual a criação do evento pode-se basear.
 * Este cache de referência deve ser o objeto de coleção de notes que representa o feed, o set de view models,
 * este set é o resultado final entregue, mas deve haver meios dele ser incluso como argumento opcional
 * de referência de forma que todas as transformações de notas possam primeiro se consultar na coleção
 * antes de retransformar um evento existente. Isso evitará que, por exemplo, se um evento tiver milhares
 * de reposts, todos esses reposts sejam transformados um a um ao invés de apenas somar um objeto simples
 * em uma estrutura central.
 */

@Injectable({
  providedIn: 'root'
})
export class RepostMapper implements SingleViewModelMapper<RepostNoteViewModel> {

  constructor(
    private guard: NostrGuard,
    private tagHelper: TagHelper,
    private zapMapper: ZapMapper,
    private profileProxy: ProfileProxy,
    private reactionMapper: ReactionMapper,
    private simpleTextMapper: SimpleTextMapper,
    @Inject(HTML_PARSER_TOKEN) private htmlfier: NoteHtmlfier,
    @Inject(NOSTR_CACHE_TOKEN) private nostrCache: NostrCache
  ) { }

  //  FIXME: refactor this into minor methods
  // eslint-disable-next-line complexity
  toViewModel(event: NostrEvent): RepostNoteViewModel {
    const content = event.content || '';
    const relates: Array<HexString> = [];
    const contentEvent = this.extractNostrEvent(content);
    const reposting = new NostrViewModelSet<EagerNoteViewModel>();

    if (contentEvent) {
      let retweeted: EagerNoteViewModel | null;
      relates.push(contentEvent.id);
      if (this.guard.isKind(contentEvent, Repost)) {
        //  there is no way to get infinity recursively, this was a stringified json
        retweeted = this.toViewModel(contentEvent);
        reposting.add(retweeted);
      } else if (this.guard.isKind(contentEvent, ShortTextNote)) {
        retweeted = this.simpleTextMapper.toViewModel(contentEvent);
        reposting.add(retweeted);
      }

    } else {
      const mentions = this.tagHelper.getMentionedEvent(event);
      for (const idEvent of mentions) {
        const retweeted = this.nostrCache.get(idEvent);
        if (retweeted) {
          const viewModel = this.toViewModel(retweeted);
          reposting.add(viewModel);
        }
      }
    }

    this.tagHelper.getRelatedEvents(event).forEach(([related]) => relates.push(related));
    const author = this.profileProxy.getRawAccount(event.pubkey);

    const note: RepostNoteViewModel = {
      author,
      id: event.id,
      createdAt: event.created_at,
      content: this.htmlfier.parse(event.content),
      media: this.htmlfier.extractMedia(event.content),
      reposting,
      //  TODO: ideally I should pass relay address from where this event come
      origin: [],
      reposted: new NostrViewModelSet<LazyNoteViewModel>(),
      mentioned: new NostrViewModelSet<LazyNoteViewModel>(),
      event,
      relates
    };

    return note;
  }

  private extractNostrEvent(content: object | string): NostrEvent | false {
    let event: object;
    if (typeof content === 'string') {
      try {
        event = JSON.parse(content);
      } catch {
        return false;
      }
    } else {
      event = content;
    }

    if (this.guard.isNostrEvent(event)) {
      return event;
    }

    return false;
  }
}
