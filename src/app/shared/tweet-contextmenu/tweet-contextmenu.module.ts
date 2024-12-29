import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TweetContextmenuComponent } from './tweet-contextmenu.component';
import { PopoverWidgetModule } from '@shared/popover-widget/popover-widget.module';
import { SvgLoaderModule } from '@shared/svg-loader/svg-loader.module';

@NgModule({
  declarations: [
    TweetContextmenuComponent
  ],
  imports: [
    CommonModule,
    PopoverWidgetModule,
    SvgLoaderModule
  ],
  exports: [
    TweetContextmenuComponent
  ]
})
export class TweetContextmenuModule { }
