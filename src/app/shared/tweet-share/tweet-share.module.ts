import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetShareComponent } from './tweet-share.component';
import { PopoverWidgetModule } from '@shared/popover-widget/popover-widget.module';
import { SvgLoaderModule } from '@shared/svg-loader/svg-loader.module';

@NgModule({
  declarations: [
    TweetShareComponent
  ],
  imports: [
    CommonModule,
    PopoverWidgetModule,
    SvgLoaderModule
  ],
  exports: [
    TweetShareComponent
  ]
})
export class TweetShareModule { }
