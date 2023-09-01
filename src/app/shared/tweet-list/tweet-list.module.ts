import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SecurityWidgetModule } from '@shared/security-widget/security-widget.module';
import { AmountModule } from '../amount/amount.module';
import { TweetButtonGroupComponent } from './tweet-button-group/tweet-button-group.component';
import { TweetListComponent } from './tweet-list.component';
import { TweetHtmlfyPipe } from './tweet/tweet-htmlfy.pipe';
import { TweetHtmlfyService } from './tweet/tweet-htmlfy.service';
import { TweetComponent } from './tweet/tweet.component';

@NgModule({
  declarations: [
    TweetListComponent,
    TweetButtonGroupComponent,
    TweetHtmlfyPipe,
    TweetComponent
  ],
  imports: [
    CommonModule,
    AmountModule,
    SecurityWidgetModule
  ],
  exports: [
    TweetListComponent
  ],
  providers: [
    TweetHtmlfyService
  ]
})
export class TweetListModule { }
