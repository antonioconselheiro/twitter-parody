import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { NostrUser } from '@domain/nostr-user';
import { CustomValidator } from '@shared/custom-validator/custom-validator';
import { NetworkErrorObservable } from '@shared/main-error/network-error.observable';
import { ProfilesObservable } from '@shared/profile-service/profiles.observable';
import { NostrSecretStatefull } from '@shared/security-service/nostr-secret.statefull';
import { AuthModalSteps } from '../auth-modal-steps.type';
import { IProfile } from '@shared/profile-service/profile.interface';
import { DataLoadType } from '@domain/data-load-type';

@Component({
  selector: 'tw-add-account-form',
  templateUrl: './add-account-form.component.html',
  styleUrls: ['./add-account-form.component.scss']
})
export class AddAccountFormComponent {

  accountForm = this.fb.group({
    nsec: ['', [
      Validators.required.bind(this),
      CustomValidator.nostrSecret
    ]],

    pin: ['', [
      Validators.required.bind(this)
    ]]
  });

  loading = false;
  submitted = false;

  showNostrSecret = false;
  showPin = false;

  @Output()
  changeStep = new EventEmitter<AuthModalSteps>();

  readonly pinLength = 6;

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
      this.nostrSecretStatefull.addAccount({ ...profile, user }, pin);
      this.changeStep.next('autenticate');
    } else {
      this.accountForm.controls['nsec'].setErrors({
        nostrSecretNotFound: true
      });
    }
  }
}
