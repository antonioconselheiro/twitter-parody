import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { NostrSecretStatefull } from './nostr-secret.statefull';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AuthModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    NostrSecretStatefull
  ]
})
export class SecurityModule { }
