import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NetworkErrorObservable } from '@shared/main-error/network-error.observable';
import { IUnauthenticatedUser } from '@shared/security-service/unauthenticated-user';
import { AuthModalSteps } from '../auth-modal-steps.type';
import { AuthenticatedProfileObservable } from '@shared/profile-service/authenticated-profile.observable';

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

  @Output()
  close = new EventEmitter<void>();

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
    private profiles$: AuthenticatedProfileObservable,
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
      this.profiles$.authenticateAccount(account, pin)
        .then(() => this.close.emit())
        //  FIXME: consigo centralizar o tratamento de catch para promises?
        .catch(e => {
          //  FIXME: validar situações onde realmente pode ocorrer
          //  um erro e tratar na tela com uma mensagem
          this.networkError$.next(e);
        })
        .finally(() => this.loading = false);
    } catch {
      this.loading = false;
      this.authenticateForm.controls.pin.setErrors({
        invalid: true
      });
    }
  }
}
