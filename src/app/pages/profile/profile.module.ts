import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { TweetModule } from '@shared/tweet/tweet.module';

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
  ]
})
export class ProfileModule { }
