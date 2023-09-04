import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarksComponent } from './bookmarks.component';

@NgModule({
  declarations: [
    BookmarksComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BookmarksComponent
  ]
})
export class BookmarksModule { }
