import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { BookmarksComponent } from './pages/bookmarks/bookmarks.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { ListsComponent } from './pages/lists/lists.component';
import { ProfileComponent } from './pages/profile/profile.component';

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
    path: 'lists',
    component: ListsComponent
  },

  {
    path: 'profile',
    component: ProfileComponent
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
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
