import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalableDirective } from '@shared/modal/modalable.directive';
import { IProfile } from '@shared/profile-service/profile.interface';
import { Subject, Subscription } from 'rxjs';
import { NostrSecretStatefull } from '../nostr-secret.statefull';
import { IUnauthenticatedUser } from '../unauthenticated-user';

@Component({
  selector: 'tw-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent
  extends ModalableDirective<IProfile | null, IProfile | null>
  implements OnInit, OnDestroy {

  response = new Subject<void | IProfile | null>();
  private subscriptions = new Subscription();

  accounts: IUnauthenticatedUser[] = [];
  auth: IProfile | null = null;

  constructor(
    private nostrSecretStatefull: NostrSecretStatefull
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(this.nostrSecretStatefull.accounts$.subscribe({
      next: accounts => this.accounts = accounts
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  override onInjectData(data: IProfile | null): void {
    this.auth = data;
  }
}
