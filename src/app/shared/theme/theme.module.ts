import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileModule } from '@belomonte/nostr-ngx';
import { ThemeObservable } from './theme.observable';

@NgModule({
  imports: [
    CommonModule,
    ProfileModule
  ],
  providers: [
    ThemeObservable
  ]
})
export class ThemeModule { }
