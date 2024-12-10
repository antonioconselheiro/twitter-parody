import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TimelineComponent } from './timeline.component';
import { TweetWidgetModule } from '@shared/tweet-widget/tweet-widget.module';
import { ProfileWidgetModule } from '@belomonte/nostr-gui-ngx';

@NgModule({
  declarations: [
    TimelineComponent
  ],
  imports: [
    CommonModule,
    TweetWidgetModule,
    ProfileWidgetModule
  ]
})
export class TimelineModule { }
