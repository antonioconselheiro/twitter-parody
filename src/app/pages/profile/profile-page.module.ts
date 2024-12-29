import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileWidgetModule, SvgRenderModule } from '@belomonte/nostr-gui-ngx';
import { ProfilePageComponent } from './profile-page.component';
import { TweetWidgetModule } from '@shared/tweet-widget/tweet-widget.module';
import { PopoverWidgetModule } from '@shared/popover-widget/popover-widget.module';

@NgModule({
  declarations: [
    ProfilePageComponent
  ],
  imports: [
    CommonModule,
    SvgRenderModule,
    ProfileWidgetModule,
    TweetWidgetModule,
    PopoverWidgetModule
  ],
  exports: [
    ProfilePageComponent
  ]
})
export class ProfilePageModule { }
