import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IUnauthenticatedUser } from '@shared/security-service/unauthenticated-user';
import { AuthModalSteps } from '../auth-modal-steps.type';

@Component({
  selector: 'tw-autenticate-form',
  templateUrl: './autenticate-form.component.html',
  styleUrls: ['./autenticate-form.component.scss']
})
export class AutenticateFormComponent {
  
  @Input()
  account: IUnauthenticatedUser | null = null;

  @Output()
  changeStep = new EventEmitter<AuthModalSteps>();
}
