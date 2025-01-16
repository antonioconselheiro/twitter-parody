import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProfileModule } from '@belomonte/nostr-ngx';
import { NoteHtmlfierModule } from '@shared/htmlfier/note-htmlfier.module';
import { AccountViewModelProxy } from './account-view-model.proxy';
import { ReactionMapper } from './reaction.mapper';
import { RepostMapper } from './repost.mapper';
import { SimpleTextMapper } from './simple-text.mapper';
import { TagHelper } from './tag.helper';
import { ZapMapper } from './zap.mapper';

@NgModule({
  imports: [
    CommonModule,
    ProfileModule,
    NoteHtmlfierModule
  ],
  providers: [
    AccountViewModelProxy,
    SimpleTextMapper,
    RepostMapper,
    ReactionMapper,
    ZapMapper,
    TagHelper
  ]
})
export class ViewModelMapperModule { }
