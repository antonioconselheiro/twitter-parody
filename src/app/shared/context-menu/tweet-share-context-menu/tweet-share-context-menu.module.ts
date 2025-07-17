import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetShareContextMenuComponent } from './tweet-share-context-menu.component';
import { PopoverWidgetModule } from '@shared/popover-widget/popover-widget.module';
import { SvgLoaderModule } from '@shared/svg-loader/svg-loader.module';

@NgModule({
  declarations: [
    TweetShareContextMenuComponent
  ],
  imports: [
    CommonModule,
    PopoverWidgetModule,
    SvgLoaderModule
  ],
  exports: [
    TweetShareContextMenuComponent
  ]
})
export class TweetShareContextMenuModule { }
