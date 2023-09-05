import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilesObservable } from './profiles.observable';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ProfilesObservable
  ]
})
export class ProfileServiceModule { }
