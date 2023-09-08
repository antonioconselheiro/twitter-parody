import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { NostrSecretStatefull } from './nostr-secret.statefull';

@NgModule({
  declarations: [
    AuthModalComponent
  ],
  imports: [
    CommonModule
  ],
  providers: [
    NostrSecretStatefull
  ]
})
export class SecurityModule { }
