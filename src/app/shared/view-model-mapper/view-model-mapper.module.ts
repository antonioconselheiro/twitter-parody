import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsMapper } from './tags.mapper';
import { SimpleTextMapper } from './simple-text.mapper';
import { ZapMapper } from './zap.mapper';
import { ReactionMapper } from './reaction.mapper';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    SimpleTextMapper,
    ReactionMapper,
    ZapMapper,
    TagsMapper
  ]
})
export class ViewModelMapperModule { }
