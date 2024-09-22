import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileWidgetModule } from '@belomonte/nostr-gui-ngx';
import { TimelineComponent } from './timeline.component';

@NgModule({
  declarations: [
    TimelineComponent
  ],
  imports: [
    CommonModule,
    ProfileWidgetModule
  ]
})
export class TimelineModule { }
