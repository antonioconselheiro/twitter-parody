import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoadingWidgetModule, ProfileWidgetModule } from '@belomonte/nostr-gui-ngx';
import { PickerComponent } from '@ctrl/ngx-emoji-mart';
import { DatetimeWidgetModule } from '@shared/datetime-widget/datetime-widget.module';
import { PopoverWidgetModule } from '@shared/popover-widget/popover-widget.module';
import { SecurityWidgetModule } from '@shared/security-widget/security-widget.module';
import { SvgLoaderModule } from '@shared/svg-loader/svg-loader.module';
import { TweetServiceModule } from '@shared/tweet-service/tweet-service.module';
import { AmountModule } from '../amount/amount.module';
import { TweetNostr } from '../tweet-service/tweet.nostr';
import { TweetButtonGroupComponent } from './tweet-button-group/tweet-button-group.component';
import { TweetContentComponent } from './tweet-content/tweet-content.component';
import { TweetImageViewerComponent } from './tweet-image-viewer/tweet-image-viewer.component';
import { NoteRepostedDescriptionPipe } from './tweet-list/note-reposted-description.pipe';
import { TweetListComponent } from './tweet-list/tweet-list.component';
import { TweetWriteButtonGroupComponent } from './tweet-write-button-group/tweet-write-button-group.component';
import { TweetWriteComponent } from './tweet-write/tweet-write.component';
import { TweetComponent } from './tweet/tweet.component';
import { TweetShareContextMenuModule } from '@shared/context-menu/tweet-share-context-menu/tweet-share-context-menu.module';
import { TweetContextMenuModule } from '@shared/context-menu/tweet-context-menu/tweet-context-menu.module';

@NgModule({
  declarations: [
    TweetComponent,
    TweetContentComponent,
    TweetWriteComponent,
    TweetListComponent,
    TweetButtonGroupComponent,
    TweetWriteButtonGroupComponent,
    TweetImageViewerComponent,
    NoteRepostedDescriptionPipe
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
    LoadingWidgetModule,
    TweetServiceModule
],
  exports: [
    TweetListComponent,
    TweetWriteComponent,
    TweetContentComponent,
    TweetComponent,

    TweetContextMenuModule,
    TweetShareContextMenuModule
  ],
  providers: [
    TweetNostr
  ]
})
export class TweetWidgetModule { }
