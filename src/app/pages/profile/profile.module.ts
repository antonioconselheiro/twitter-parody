import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetModule } from '@shared/tweet/tweet.module';
import { ProfileApi } from '../../shared/profile-service/profile.api';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    TweetModule
  ],
  exports: [
    ProfileComponent
  ],
  providers: [
    ProfileApi
  ]
})
export class ProfileModule { }
