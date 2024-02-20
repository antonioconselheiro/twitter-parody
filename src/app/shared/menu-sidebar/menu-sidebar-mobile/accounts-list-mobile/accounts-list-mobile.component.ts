import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IProfile } from '@domain/profile.interface';
import { AuthModalComponent } from '@shared/auth-modal/auth-modal.component';
import { ModalService } from '@belomonte/async-modal-ngx';
import { NostrSecretStatefull } from '@shared/security-service/nostr-secret.statefull';
import { IUnauthenticatedUser } from '@shared/security-service/unauthenticated-user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-accounts-list-mobile',
  templateUrl: './accounts-list-mobile.component.html',
  styleUrls: ['./accounts-list-mobile.component.scss']
})
export class AccountsListMobileComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  @Input()
  profile: IProfile | null = null;

  accounts: IUnauthenticatedUser[] = [];

  constructor(
    private modalService: ModalService,
    private nostrSecretStatefull: NostrSecretStatefull
  ) { }

  ngOnInit(): void {
    this.subscriptions.add(this.nostrSecretStatefull.accounts$.subscribe({
      next: accounts => this.accounts = accounts
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  addAccountModal(): void {
    this.modalService
    .createModal(AuthModalComponent)
    .setData({
      title: 'Accounts',
      currentAuthProfile: this.profile,
      currentStep: 'add-account'
    })
    .build();
  }
}
