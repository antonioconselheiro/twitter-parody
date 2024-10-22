import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsMapper } from './tags.mapper';
import { SimpleTextMapper } from './simple-text.mapper';
import { ZapMapper } from './zap.mapper';
import { ReactionMapper } from './reaction.mapper';
import { NoteHtmlfierModule } from '@shared/htmlfier/note-htmlfier.module';

@NgModule({
  imports: [
    CommonModule,
    NoteHtmlfierModule
  ],
  providers: [
    SimpleTextMapper,
    ReactionMapper,
    ZapMapper,
    TagsMapper
  ]
})
export class ViewModelMapperModule { }
