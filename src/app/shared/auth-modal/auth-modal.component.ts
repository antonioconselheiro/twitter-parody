/* eslint-disable @typescript-eslint/unbound-method */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalableDirective } from '@shared/modal/modalable.directive';
import { IProfile } from '@shared/profile-service/profile.interface';
import { ProfilesObservable } from '@shared/profile-service/profiles.observable';
import { NostrSecretStatefull } from '@shared/security-service/nostr-secret.statefull';
import { IUnauthenticatedUser } from '@shared/security-service/unauthenticated-user';
import { Subject, Subscription } from 'rxjs';
import { AuthModalSteps } from './auth-modal-steps.type';

@Component({
  selector: 'tw-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss']
})
export class AuthModalComponent
  extends ModalableDirective<IProfile | null, IProfile | null>
  implements OnInit, OnDestroy {

  private subscriptions = new Subscription();
  response = new Subject<void | IProfile | null>();

  auth: IProfile | null = null;
  accounts: IUnauthenticatedUser[] = [];
  
  authenticatingAccount: IUnauthenticatedUser | null = null;
  currentStep: AuthModalSteps | null = null;

  constructor(
    private profiles$: ProfilesObservable,
    private nostrSecretStatefull: NostrSecretStatefull
  ) {
    super();
  }

  ngOnInit(): void {
    this.bindAccountsSubscription();
    this.setInitialScreen();
  }

  private bindAccountsSubscription(): void {
    this.subscriptions.add(this.nostrSecretStatefull.accounts$.subscribe({
      next: accounts => this.accounts = accounts
    }));
  }

  onChangeStep(step: AuthModalSteps): void {
    // let a tick to the screen click effect
    // eslint-disable-next-line ban/ban
    setTimeout(() => this.currentStep = step);
  }

  private setInitialScreen(): void {
    this.currentStep = this.accounts.length ? 'select-account' : 'add-account';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  override onInjectData(data: IProfile | null): void {
    this.auth = data;
  }
}
