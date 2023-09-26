import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticatedProfileObservable } from './authenticated-profile.observable';
import { ProfileApi } from './profile.api';
import { ProfileConverter } from './profile.converter';
import { ProfileCache } from './profile.cache';
import { ProfileProxy } from './profile.proxy';
import { ProfileEncrypt } from './profile.encrypt';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ProfileApi,
    ProfileCache,
    ProfileProxy,
    ProfileEncrypt,
    ProfileConverter,
    AuthenticatedProfileObservable
  ]
})
export class ProfileServiceModule { }
