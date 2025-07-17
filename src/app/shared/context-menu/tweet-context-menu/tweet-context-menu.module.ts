import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetContextMenuComponent } from './tweet-context-menu.component';
import { PopoverWidgetModule } from '@shared/popover-widget/popover-widget.module';
import { SvgLoaderModule } from '@shared/svg-loader/svg-loader.module';

@NgModule({
  declarations: [
    TweetContextMenuComponent
  ],
  imports: [
    CommonModule,
    PopoverWidgetModule,
    SvgLoaderModule
  ],
  exports: [
    TweetContextMenuComponent
  ]
})
export class TweetContextMenuModule { }
