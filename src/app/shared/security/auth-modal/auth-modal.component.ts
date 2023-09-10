/* eslint-disable @typescript-eslint/unbound-method */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { NostrUser } from '@domain/nostr-user';
import { CustomValidator } from '@shared/custom-validator/custom-validator';
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
  
  private subscriptions = new Subscription();

  response = new Subject<void | IProfile | null>();
  readonly pinLength = 6;

  accountForm = this.fb.group({
    nsec: ['', [
      Validators.required,
      CustomValidator.nostrSecret
    ]],

    pin: ['', [
      Validators.required
    ]]
  });

  accounts: IUnauthenticatedUser[] = [];
  auth: IProfile | null = null;

  loading = false;
  submitted = false;

  showNostrSecret = false;
  showPin = false;

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

  logout(account: IUnauthenticatedUser): void {
    this.nostrSecretStatefull.removeAccount(account);
  }

  getFormControlErrors(fieldName: 'nsec' | 'pin'): ValidationErrors | null {
    return this.accountForm.controls[fieldName].errors;
  }

  getFormControlErrorStatus(fieldName: 'nsec' | 'pin', error: string): boolean {
    const errors = this.accountForm.controls[fieldName].errors || {};
    return errors[error] || false;
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
    
    this.accountForm.reset();
    this.submitted = false;

    const user = new NostrUser(nsec);
    this.loading = true;
    this.profiles$
      .load(user.nostrPublic)
      .then(profile => this.nostrSecretStatefull.addAccount({ ...profile, user }, pin))
      //  FIXME: consigo centralizar o tratamento de catch para promises?
      .catch(e => this.networkError$.next(e))
      .finally(() => this.loading = false);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  override onInjectData(data: IProfile | null): void {
    this.auth = data;
  }
}
