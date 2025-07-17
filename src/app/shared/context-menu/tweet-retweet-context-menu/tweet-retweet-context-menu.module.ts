import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PopoverWidgetModule } from '@shared/popover-widget/popover-widget.module';
import { SvgLoaderModule } from '@shared/svg-loader/svg-loader.module';
import { TweetRetweetContextMenuComponent } from './tweet-retweet-context-menu.component';

@NgModule({
  declarations: [
    TweetRetweetContextMenuComponent
  ],
  imports: [
    CommonModule,
    PopoverWidgetModule,
    SvgLoaderModule
  ],
  exports: [
    TweetRetweetContextMenuComponent
  ]
})
export class TweetRetweetContextMenuModule { }
