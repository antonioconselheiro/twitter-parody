import { Pipe, PipeTransform } from '@angular/core';
import { AccountGuard, AccountRenderable, CurrentAccountObservable, HexString } from '@belomonte/nostr-ngx';
import { NostrViewModelSet } from '@view-model/nostr-view-model.set';
import { NoteViewModel } from '@view-model/note.view-model';

/**
 * FIXME: Aqui me parece um local que talvez eu deva cobrir com teste unitários, são objetos sendo transformados em string,
 *        os tipos estritos do typescript não me ajudam a diminuir a ocorrência de erros lógicos.
 *        Os testes unitários devem observar que há um aspecto de aleatoriedade na escolha dos nomes e há também uma dependência
 *        o mecanismo de autenticação (muda o resultado de acordo com quem estiver "autenticado")
 * FIXME: trocar as strings em inglês para o parâmetro de internacionaliação, quando uma biblioteca de internacionalização for escolhida
 */
@Pipe({
  name: 'noteRepostedDescription'
})
export class NoteRepostedDescriptionPipe implements PipeTransform {

  constructor(
    private accountGuard: AccountGuard,
    private currentAccount$: CurrentAccountObservable
  ) { }

  transform(noteSet: NostrViewModelSet<NoteViewModel>, feedPublisherAccount: HexString | undefined, howManyShow = 1, showAmount = false): string {
    if (!noteSet.size) {
      return '';
    }

    const names = this.getDescriptionDisplayNames(noteSet, feedPublisherAccount, howManyShow);
    if (showAmount) {
      const otherAmount = noteSet.size - names.length;
      if (names.length) {
        names.push(`other ${otherAmount}`);
      } else {
        names.push(String(otherAmount));
      }
    }

    const lastUserDisplayName = names.pop();
    const description = [names.join(', '), lastUserDisplayName].filter(has => has && has.trim()).join(' and ')
    return description;
  }

  private getDescriptionDisplayNames(noteSet: NostrViewModelSet<NoteViewModel>, feedPublisherAccount: HexString | undefined, howManyShow: number): Array<string> {
    const accounts = this.getAccounts(noteSet, feedPublisherAccount, howManyShow);
    const authenticated = this.currentAccount$.getValue();
    const names = accounts.map(account => {
      if (authenticated && feedPublisherAccount && authenticated.pubkey === feedPublisherAccount && account.pubkey === feedPublisherAccount) {
        return `You`;
      } else {
        return account.displayName;
      }
    });

    return names;
  }

  private getAccounts(noteSet: NostrViewModelSet<NoteViewModel>, feedPublisherAccount: HexString | undefined, howManyShow: number): Array<AccountRenderable> {
    const accounts: Array<AccountRenderable> = [];
    const noteList = [...noteSet].filter(note => note.author);

    if (feedPublisherAccount) {
      const feedPublisherReposted = this.findAuthor(noteList, feedPublisherAccount);
      if (feedPublisherReposted) {
        accounts.push(feedPublisherReposted);
      }
    }

    while (accounts.length < howManyShow && noteList.length) {
      const randomIndex = Math.floor(Math.random() * noteList.length);
      const [note] = noteList.splice(randomIndex, 1);

      if (this.accountGuard.isEssential(note.author)) {
        accounts.push(note.author);
      }
    }

    return accounts;
  }

  private findAuthor(noteList: Array<NoteViewModel>, feedPublisherAccount: HexString): AccountRenderable | null {
    if (feedPublisherAccount) {
      for (let index = 0; index < noteList.length; index++) {
        if (feedPublisherAccount === noteList[index]?.author?.pubkey) {
          const author = noteList[index].author;
          if (this.accountGuard.isRenderableGroup(author)) {
            return author;
          } else {
            return null;
          }
        }
      }
    }

    return null;
  }

}
