import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { DataLoadType } from '@domain/data-load.type';
import { NostrUser } from '@domain/nostr-user';
import { CameraObservable } from '@shared/camera/camera.observable';
import { CustomValidator } from '@shared/custom-validator/custom-validator';
import { MainErrorObservable } from '@shared/main-error/main-error.observable';
import { NetworkErrorObservable } from '@shared/main-error/network-error.observable';
import { AuthenticatedProfileObservable } from '@shared/profile-service/authenticated-profile.observable';
import { NostrSecretStatefull } from '@shared/security-service/nostr-secret.statefull';
import { IUnauthenticatedUser } from '@shared/security-service/unauthenticated-user';
import { AuthModalSteps } from '../auth-modal-steps.type';
import { ProfileProxy } from '@shared/profile-service/profile.proxy';
import { IProfile } from '@domain/profile.interface';
import { Nip5Util } from '@shared/util/nip5.service';
import { nip19 } from 'nostr-tools';

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
    private camera$: CameraObservable,
    private error$: MainErrorObservable,
    private profileProxy: ProfileProxy,
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

  async onAddAccountSubmit(event: SubmitEvent): Promise<void> {
    event.stopPropagation();
    event.preventDefault();

    this.submitted = true;
    if (!this.accountForm.valid) {
      return;
    }

    const { pin } = this.accountForm.getRawValue();
    let { nsec } = this.accountForm.getRawValue()
    if (!nsec || !pin) {
      return;
    }

    const pubKey = (await Nip5Util.getNpubByNip5Addr(nsec))?.toString()


    if (pubKey) {
      nsec = nip19.npubEncode(pubKey);
    }

    const user = new NostrUser(nsec);
    this.loading = true;
    this.profileProxy
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

  readQrcodeUsingCamera(pin?: HTMLInputElement): void {
    this.asyncReadQrcodeUsingCamera()
      .then(() => pin?.focus())
      .catch(e => this.error$.next(e))
  }

  async asyncReadQrcodeUsingCamera(): Promise<void> {
    const nsec = await this.camera$.readQrCode();
    this.accountForm.patchValue({ nsec });
    return Promise.resolve();
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
