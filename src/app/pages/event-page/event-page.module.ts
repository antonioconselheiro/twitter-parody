import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventPageComponent } from './event-page.component';
import { ProfileWidgetModule } from '@belomonte/nostr-gui-ngx';
import { TweetWidgetModule } from '@shared/tweet-widget/tweet-widget.module';
import { PopoverWidgetModule } from '@shared/popover-widget/popover-widget.module';

@NgModule({
  declarations: [
    EventPageComponent
  ],
  imports: [
    CommonModule,
    ProfileWidgetModule,
    TweetWidgetModule,
    PopoverWidgetModule
  ],
  exports: [
    EventPageComponent
  ]
})
export class EventPageModule { }
