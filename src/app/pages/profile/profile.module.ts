import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetModule } from '@shared/tweet/tweet.module';
import { TweetApi } from '../../shared/profile-service/tweet.api';
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
    TweetApi
  ]
})
export class ProfileModule { }
