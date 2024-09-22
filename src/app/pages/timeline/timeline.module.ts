import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TweetWidgetModule } from '@shared/tweet-widget/tweet-widget.module';
import { TimelineComponent } from './timeline.component';
import { ProfileWidgetModule } from '@belomonte/nostr-gui-ngx';

@NgModule({
  declarations: [
    TimelineComponent
  ],
  imports: [
    CommonModule,
    ProfileWidgetModule,
    TweetWidgetModule
  ]
})
export class TimelineModule { }
