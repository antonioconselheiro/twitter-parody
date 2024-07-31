import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetWidgetModule } from '@shared/tweet-widget/tweet-widget.module';
import { ProfileComponent } from './profile.component';
import { ProfileWidgetModule } from '@belomonte/nostr-credential-ngx';

@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileWidgetModule,
    TweetWidgetModule
  ],
  exports: [
    ProfileComponent
  ]
})
export class ProfileModule { }
