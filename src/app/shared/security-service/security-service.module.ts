import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NostrSecretStatefull } from './nostr-secret.statefull';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
    NostrSecretStatefull
  ]
})
export class SecurityServiceModule { }
