import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NostrUser } from '@domain/nostr-user';
import { NetworkErrorObservable } from '@shared/main-error/network-error.observable';
import { ProfilesObservable } from '@shared/profile-service/profiles.observable';
import { IUnauthenticatedUser } from '@shared/security-service/unauthenticated-user';
import * as CryptoJS from 'crypto-js';
import { AuthModalSteps } from '../auth-modal-steps.type';

@Component({
  selector: 'tw-authenticate-form',
  templateUrl: './authenticate-form.component.html',
  styleUrls: ['./authenticate-form.component.scss']
})
export class AuthenticateFormComponent implements AfterViewInit {
  
  @Input()
  account: IUnauthenticatedUser | null = null;
  
  @Output()
  changeStep = new EventEmitter<AuthModalSteps>();

  @ViewChild('pin')
  pinField?: ElementRef;
  
  showPin = false;
  submitted = false;
  loading = false;

  authenticateForm = this.fb.group({
    pin: ['', [
      Validators.required.bind(this)
    ]]
  });

  constructor(
    private fb: FormBuilder,
    private profiles$: ProfilesObservable,
    private networkError$: NetworkErrorObservable
  ) { }

  ngAfterViewInit(): void {
    this.pinField?.nativeElement?.focus();
  }

  getFormControlErrorStatus(error: string): boolean {
    const errors = this.authenticateForm.controls.pin.errors || {};
    return errors[error] || false;
  }

  showErrors(): boolean {
    return this.submitted && !!this.authenticateForm.controls.pin.errors;
  }

  onAuthenticateSubmit(event: SubmitEvent): void {
    event.stopPropagation();
    event.preventDefault();
    this.submitted = true;

    const account = this.account;
    const { pin } = this.authenticateForm.getRawValue();
    if (!this.authenticateForm.valid || !account || !pin) {
      return;
    }

    this.loading = true;
    try {
      const decrypted = CryptoJS.AES.decrypt(account.nsecEncrypted, pin, {
        iv: CryptoJS.enc.Hex.parse('be410fea41df7162a679875ec131cf2c'),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      const nsec = CryptoJS.enc.Utf8.stringify(decrypted);

      const user = new NostrUser(String(nsec));
      this.updateAuthenticatedAccount(user);
    } catch {
      this.loading = false;
      this.authenticateForm.controls.pin.setErrors({
        invalid: true
      });
    }
  }

  private updateAuthenticatedAccount(user: NostrUser): void {
    this.profiles$
      .load(user.nostrPublic)
      .then(profile => this.profiles$.next({ ...profile, ...{ user }}))
      //  FIXME: consigo centralizar o tratamento de catch para promises?
      .catch(e => {
        //  FIXME: validar situações onde realmente pode ocorrer
        //  um erro e tratar na tela com uma mensagem
        this.networkError$.next(e);
      })
      .finally(() => this.loading = false);
  }
}
