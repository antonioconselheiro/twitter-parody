import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimelineComponent } from './timeline/timeline.component';
import { BookmarksComponent } from './bookmarks/bookmarks.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ExploreComponent } from './explore/explore.component';
import { MessagesComponent } from './messages/messages.component';

const routes: Routes = [
  {
    path: 'home',
    component: TimelineComponent
  },

  {
    path: 'bookmarks',
    component: BookmarksComponent
  },

  {
    path: 'notifications',
    component: NotificationsComponent
  },

  {
    path: 'explore',
    component: ExploreComponent
  },

  {
    path: 'messages',
    component: MessagesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
