import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { SecurityWidgetModule } from '@shared/security-widget/security-widget.module';
import { AmountModule } from '../amount/amount.module';
import { CompositeTweetPopoverComponent } from './composite-tweet-popover/composite-tweet-popover.component';
import { TweetButtonGroupComponent } from './tweet-button-group/tweet-button-group.component';
import { TweetHtmlfyPipe } from './tweet-htmlfy/tweet-htmlfy.pipe';
import { TweetHtmlfyService } from './tweet-htmlfy/tweet-htmlfy.service';
import { TweetImageViewerComponent } from './tweet-image-viewer/tweet-image-viewer.component';
import { TweetListComponent } from './tweet-list/tweet-list.component';
import { TweetWriteButtonGroupComponent } from './tweet-write-button-group/tweet-write-button-group.component';
import { TweetWriteComponent } from './tweet-write/tweet-write.component';
import { TweetComponent } from './tweet/tweet.component';
import { TweetApi } from '../tweet-service/tweet.api';

@NgModule({
  declarations: [
    TweetListComponent,
    TweetButtonGroupComponent,
    TweetHtmlfyPipe,
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
    FormsModule
  ],
  exports: [
    TweetListComponent,
    TweetWriteComponent,
    TweetComponent,
    TweetHtmlfyPipe,
    CompositeTweetPopoverComponent
  ],
  providers: [
    TweetHtmlfyService,
    TweetApi
  ]
})
export class TweetWidgetModule { }
