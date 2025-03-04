import { Pipe, PipeTransform } from '@angular/core';
import { AccountGuard, AccountRenderable, HexString } from '@belomonte/nostr-ngx';
import { NostrViewModelSet } from '@view-model/nostr-view-model.set';
import { NoteViewModel } from '@view-model/note.view-model';

@Pipe({
  name: 'noteRepostedDescription'
})
export class NoteRepostedDescriptionPipe implements PipeTransform {

  constructor(
    private accountGuard: AccountGuard
  ) { }


  //  Possibilidades:
  //  Você retweetou:
  //  Você e Seguidor 1 retweetaram:
  //  Seguidor 1 e Seguidor 2 retweetaram:
  //  Seguidor 1, Seguidor 2 e Seguidor 3 retweetaram:

  //  Seguidor 1, Seguidor 2 e mais 33 seguem

  //  FIXME: TODO: TODOING: tem algumas questões quando vamos formar os nomes
  //  que mostram quem repostou um note: no twitter, se estou vendo meu próprio
  //  feed, é mostrado a mim "Você retweetou", entretanto, se estou vendo o feed
  //  de outro e eu repostei, "Você retweetou e mais 6 pessoas" seria a forma
  //  correta? E somente no caso de você não ter retweetado que é exibido um
  //  outro nome? E como esse nome deve ser selecionado entre outros? Deve haver
  //  um algoritmo inteligente para selecionar: um algoritmo de aleatoriedade?
  //  (dentro das contas repostadoras que tem informações essenciais carregadas)
  // eslint-disable-next-line complexity
  transform(noteSet: NostrViewModelSet<NoteViewModel>, feedPublisherAccount: HexString | undefined, howManyShow = 1): string {
    if (!noteSet.size) {
      return '';
    }

    const accounts: Array<AccountRenderable> = [];
    const noteList = [...noteSet].filter(note => note.author);
    let feedPublisherReposted = false;

    while (accounts.length < howManyShow && noteList.length) {
      const randomIndex = Math.floor(Math.random() * noteList.length);
      const [note] = noteList.splice(randomIndex, 1);

      if (feedPublisherAccount && feedPublisherAccount === note.author.pubkey) {
        feedPublisherReposted = true;
      }

      if (this.accountGuard.isEssential(note.author)) {
        accounts.push(note.author);
      }
    }

    if (!feedPublisherReposted && feedPublisherAccount) {
      feedPublisherReposted = this.findAuthor(noteList, feedPublisherAccount);
    }

    //  Se existe um feed publisher account, então ele deve ter o nome exibido primeiro se estiver incluso na listagem de repostadores
    //  Se há seguidos na lista de seguidores que estejam presentes na lista de quem compartilhou, então o nome deles deve ser exibido em ordem aleatória
    //  Deve-se exibir no máximo três nomes, mas deve-se haver espaço para configurar a quantidade máxima de nomes exibidos

    return null;
  }

  private findAuthor(noteList: Array<NoteViewModel>, feedPublisherAccount: HexString): boolean {
    if (feedPublisherAccount) {
      for (let index = 0; index < noteList.length; index++) {
        if (feedPublisherAccount === noteList[index].author.pubkey) {
          return true;
        }
      }
    }

    return false;
  }

}
