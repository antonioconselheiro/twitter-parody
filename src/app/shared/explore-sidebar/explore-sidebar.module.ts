import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExploreSidebarComponent } from './explore-sidebar.component';
import { TrendingTopicsShortcutComponent } from './trending-topics-shortcut/trending-topics-shortcut.component';
import { FollowSuggestionsComponent } from './follow-suggestions/follow-suggestions.component';
import { LiveSpacesShortcutComponent } from './live-spaces-shortcut/live-spaces-shortcut.component';

@NgModule({
  declarations: [
    ExploreSidebarComponent,
    TrendingTopicsShortcutComponent,
    FollowSuggestionsComponent,
    LiveSpacesShortcutComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ExploreSidebarComponent
  ]
})
export class ExploreSidebarModule { }
