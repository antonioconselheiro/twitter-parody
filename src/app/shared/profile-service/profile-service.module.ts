import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilesObservable } from './profiles.observable';
import { ProfileApi } from './profile.api';
import { ProfileConverter } from './profile.converter';
import { ProfileCache } from './profile.cache';
import { ProfileFacade } from './profile.facade';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    ProfileApi,
    ProfileCache,
    ProfileFacade,
    ProfileConverter,
    ProfilesObservable
  ]
})
export class ProfileServiceModule { }
