import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { NostrUser } from '@domain/nostr-user';
import { CustomValidator } from '@shared/custom-validator/custom-validator';
import { NetworkErrorObservable } from '@shared/main-error/network-error.observable';
import { ProfilesObservable } from '@shared/profile-service/profiles.observable';
import { NostrSecretStatefull } from '@shared/security-service/nostr-secret.statefull';
import { AuthModalSteps } from '../auth-modal-steps.type';
import { IProfile } from '@shared/profile-service/profile.interface';
import { DataLoadType } from '@domain/data-load-type';
import { IUnauthenticatedUser } from '@shared/security-service/unauthenticated-user';

@Component({
  selector: 'tw-add-account-form',
  templateUrl: './add-account-form.component.html',
  styleUrls: ['./add-account-form.component.scss']
})
export class AddAccountFormComponent {

  @Input()
  accounts: IUnauthenticatedUser[] = [];

  loading = false;
  submitted = false;

  showNostrSecret = false;
  showPin = false;

  @Output()
  changeStep = new EventEmitter<AuthModalSteps>();

  @Output()
  selected = new EventEmitter<IUnauthenticatedUser>();

  readonly pinLength = 6;

  accountForm = this.fb.group({
    nsec: ['', [
      Validators.required.bind(this),
      CustomValidator.nostrSecret
    ]],

    pin: ['', [
      Validators.required.bind(this)
    ]]
  });

  constructor(
    private fb: FormBuilder,
    private profiles$: ProfilesObservable,
    private networkError$: NetworkErrorObservable,
    private nostrSecretStatefull: NostrSecretStatefull
  ) { }

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

    const user = new NostrUser(nsec);
    this.loading = true;
    this.profiles$
      .load(user.nostrPublic)
      .then(profile => this.addAccount(profile, user, pin))
      //  FIXME: consigo centralizar o tratamento de catch para promises?
      .catch(e => {
        //  FIXME: validar situações onde realmente pode ocorrer
        //  um erro e tratar na tela com uma mensagem
        this.networkError$.next(e);
      })
      .finally(() => this.loading = false);
  }

  private addAccount(profile: IProfile, user: NostrUser, pin: string): void {
    if (profile.load === DataLoadType.EAGER_LOADED) {
      this.accountForm.reset();
      const unauthenticatedAccount = this.nostrSecretStatefull.addAccount({ ...profile, user }, pin);
      if (!unauthenticatedAccount) {
        this.changeStep.next('select-account');
      } else {
        this.selected.next(unauthenticatedAccount);
        this.changeStep.next('authenticate');
      }

    } else {
      this.accountForm.controls['nsec'].setErrors({
        nostrSecretNotFound: true
      });
    }
  }
}
