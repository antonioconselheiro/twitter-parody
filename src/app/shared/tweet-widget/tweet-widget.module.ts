import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { DatetimeWidgetModule } from '@shared/datetime-widget/datetime-widget.module';
import { PopoverWidgetModule } from '@shared/popover-widget/popover-widget.module';
import { SecurityWidgetModule } from '@shared/security-widget/security-widget.module';
import { AmountModule } from '../amount/amount.module';
import { TweetApi } from '../tweet-service/tweet.api';
import { CompositeTweetPopoverComponent } from './composite-tweet-popover/composite-tweet-popover.component';
import { TweetButtonGroupComponent } from './tweet-button-group/tweet-button-group.component';
import { TweetImageViewerComponent } from './tweet-image-viewer/tweet-image-viewer.component';
import { TweetWriteButtonGroupComponent } from './tweet-write-button-group/tweet-write-button-group.component';
import { TweetWriteComponent } from './tweet-write/tweet-write.component';
import { TweetComponent } from './tweet/tweet.component';
import { TweetListComponent } from './tweet-list/tweet-list.component';
import { LoadingWidgetModule, ProfileWidgetModule } from '@belomonte/nostr-gui-ngx';
import { SvgLoaderModule } from '@shared/svg-loader/svg-loader.module';

@NgModule({
  declarations: [
    TweetListComponent,
    TweetButtonGroupComponent,
    TweetComponent,
    TweetWriteComponent,
    TweetWriteButtonGroupComponent,
    CompositeTweetPopoverComponent,
    TweetImageViewerComponent
  ],
  imports: [
    CommonModule,
    AmountModule,
    SecurityWidgetModule,
    PickerComponent,
    PopoverWidgetModule,
    ProfileWidgetModule,
    DatetimeWidgetModule,
    FormsModule,
    SvgLoaderModule,
    LoadingWidgetModule
  ],
  exports: [
    TweetListComponent,
    TweetWriteComponent,
    TweetComponent,
    CompositeTweetPopoverComponent
  ],
  providers: [
    TweetApi
  ]
})
export class TweetWidgetModule { }
