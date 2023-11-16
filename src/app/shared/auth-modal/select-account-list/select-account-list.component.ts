import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUnauthenticatedUser } from '@shared/security-service/unauthenticated-user';
import { AuthModalSteps } from '../auth-modal-steps.type';
import { NostrSecretStatefull } from '@shared/security-service/nostr-secret.statefull';

@Component({
  selector: 'tw-select-account-list',
  templateUrl: './select-account-list.component.html',
  styleUrls: ['./select-account-list.component.scss']
})
export class SelectAccountListComponent {

  @Input()
  accounts: IUnauthenticatedUser[] = [];

  @Output()
  changeStep = new EventEmitter<AuthModalSteps>();

  @Output()
  selected = new EventEmitter<IUnauthenticatedUser>();

  constructor(
    private nostrSecretStatefull: NostrSecretStatefull
  ) { }

  logout(account: IUnauthenticatedUser): void {
    this.nostrSecretStatefull.removeAccount(account);

    //  wait the observable send centralizated
    //  and updated info of account amount
    // eslint-disable-next-line ban/ban
    setTimeout(() => {
      if (!this.accounts.length) {
        this.changeStep.next('add-account');
      }
    });
  }

  selectAccount(account: IUnauthenticatedUser): void {
    this.selected.emit(account);
    this.changeStep.next('authenticate');
  }
}
