import { Pipe, PipeTransform } from '@angular/core';
import { Account } from '@belomonte/nostr-ngx';
import { NoteViewModel } from '@view-model/note.view-model';

@Pipe({
  name: 'noteRepostedDescription'
})
export class NoteRepostedDescriptionPipe implements PipeTransform {


  //  FIXME: TODO: TODOING: tem algumas questões quando vamos formar os nomes
  //  que mostram quem repostou um note: no twitter, se estou vendo meu próprio
  //  feed, é mostrado a mim "Você retweetou", entretanto, se estou vendo o feed
  //  de outro e eu repostei, "Você retweetou e mais 6 pessoas" seria a forma
  //  correta? E somente no caso de você não ter retweetado que é exibido um
  //  outro nome? E como esse nome deve ser selecionado entre outros? Deve haver
  //  um algoritmo inteligente para selecionar: um algoritmo de aleatoriedade?
  //  (dentro das contas repostadoras que tem informações essenciais carregadas)
  transform(note: NoteViewModel<Account>): string {
    console.info('note respoted description');
    const

      [...note.reposted].forEach(note => {

      });

    return null;
  }

}
