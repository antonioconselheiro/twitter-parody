import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoteHtmlfierModule } from '@shared/htmlfier/note-htmlfier.module';
import { ReactionMapper } from './reaction.mapper';
import { RepostMapper } from './repost.mapper';
import { SimpleTextMapper } from './simple-text.mapper';
import { TagHelper } from './tag.helper';
import { ZapMapper } from './zap.mapper';
import { ProfileModule } from '@belomonte/nostr-ngx';

@NgModule({
  imports: [
    CommonModule,
    ProfileModule,
    NoteHtmlfierModule
  ],
  providers: [
    SimpleTextMapper,
    RepostMapper,
    ReactionMapper,
    ZapMapper,
    TagHelper
  ]
})
export class ViewModelMapperModule { }
