import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetListComponent } from './tweet-list.component';
import { AmountModule } from '../amount/amount.module';
import { TweetButtonGroupComponent } from './tweet-button-group/tweet-button-group.component';
import { TweetHtmlfyPipe } from './tweet-htmlfy.pipe';
import { TweetHtmlfyService } from './tweet-htmlfy.service';

@NgModule({
  declarations: [
    TweetListComponent,
    TweetButtonGroupComponent,
    TweetHtmlfyPipe
  ],
  imports: [
    CommonModule,
    AmountModule
  ],
  exports: [
    TweetListComponent
  ],
  providers: [
    TweetHtmlfyService
  ]
})
export class TweetListModule { }
