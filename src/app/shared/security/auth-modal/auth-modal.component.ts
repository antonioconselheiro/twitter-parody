/* eslint-disable @typescript-eslint/unbound-method */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { NostrUser } from '@domain/nostr-user';
import { NetworkErrorObservable } from '@shared/main-error/network-error.observable';
import { ModalableDirective } from '@shared/modal/modalable.directive';
import { IProfile } from '@shared/profile-service/profile.interface';
import { ProfilesObservable } from '@shared/profile-service/profiles.observable';
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
  accountForm = this.fb.group({
    nsec: ['', [Validators.required]],
    pin: ['', [Validators.required]]
  });

  accounts: IUnauthenticatedUser[] = [];
  auth: IProfile | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private profiles$: ProfilesObservable,
    private networkError$: NetworkErrorObservable,
    private nostrSecretStatefull: NostrSecretStatefull
  ) {
    super();
  }

  ngOnInit(): void {
    this.bindAccountsSubscription();
  }
  
  private bindAccountsSubscription(): void {
    this.subscriptions.add(this.nostrSecretStatefull.accounts$.subscribe({
      next: accounts => this.accounts = accounts
    }));  
  }

  getFormControlErrors(fielName: 'nsec' | 'pin'): ValidationErrors | null {
    return this.accountForm.controls[fielName].errors;
  }

  onAddAccountSubmit(event: SubmitEvent): void {
    event.stopPropagation();
    event.preventDefault();

    this.submitted = true;
    if (!this.accountForm.valid) {
      return;
    }

    const { nsec, pin } = this.accountForm.getRawValue();
    if (!nsec || !pin) {
      return;
    }

    const user = new NostrUser(nsec);
    this.profiles$
      .load(user.nostrPublic)
      .then(profile => this.nostrSecretStatefull.addAccount({ ...profile, user }, pin))
      .catch(e => this.networkError$.next(e));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  override onInjectData(data: IProfile | null): void {
    this.auth = data;
  }
}
