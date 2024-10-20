import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsMapper } from './tags.mapper';
import { SimpleTextMapper } from './simple-text.mapper';
import { ZapMapper } from './zap.mapper';
import { ReactionMapper } from './reaction.mapper';
import { HtmlfyServiceModule } from '@shared/htmlfy/htmlfy-service.module';

@NgModule({
  imports: [
    CommonModule,
    HtmlfyServiceModule
  ],
  providers: [
    SimpleTextMapper,
    ReactionMapper,
    ZapMapper,
    TagsMapper
  ]
})
export class ViewModelMapperModule { }
