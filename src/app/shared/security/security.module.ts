import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthModalComponent } from './auth-modal/auth-modal.component';
import { NostrSecretStatefull } from './nostr-secret.statefull';
import { ReactiveFormsModule } from '@angular/forms';
import { LoadingModule } from '@shared/loading/loading.module';

@NgModule({
  declarations: [
    AuthModalComponent
  ],
  imports: [
    CommonModule,
    LoadingModule,
    ReactiveFormsModule
  ],
  providers: [
    NostrSecretStatefull
  ]
})
export class SecurityModule { }
