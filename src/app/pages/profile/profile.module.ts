import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetModule } from '@shared/tweet/tweet.module';
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
  ]
})
export class ProfileModule { }
