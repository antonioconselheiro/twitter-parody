import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookmarksComponent } from './pages/bookmarks/bookmarks.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { ListsComponent } from './pages/lists/lists.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TimelineComponent } from './pages/timeline/timeline.component';
import { profileResolverFn } from './pages/profile/profile.resolve-fn';
import { menuActiveResolverFn } from '@shared/menu-sidebar/menu-active.resolve-fn';
import { MenuType } from '@shared/menu-sidebar/menu-type.enum';

const routes: Routes = [
  {
    path: 'home',
    component: TimelineComponent,
    resolve: {
      menu: menuActiveResolverFn
    },
    data: {
      menu: MenuType.HOME
    }
  },

  {
    path: 'bookmarks',
    component: BookmarksComponent,
    resolve: {
      menu: menuActiveResolverFn
    },
    data: {
      menu: MenuType.BOOKMARKS
    }
  },

  {
    path: 'lists',
    component: ListsComponent,
    resolve: {
      menu: menuActiveResolverFn
    },
    data: {
      menu: MenuType.LISTS
    }
  },

  {
    path: 'p/:npub',
    component: ProfileComponent,
    resolve: {
      profile: profileResolverFn,
      menu: menuActiveResolverFn
    },
    data: {
      menu: MenuType.PROFILE
    }
  },

  {
    path: 'notifications',
    component: NotificationsComponent,
    resolve: {
      menu: menuActiveResolverFn
    },
    data: {
      menu: MenuType.NOTIFICATIONS
    }
  },

  {
    path: 'explore',
    component: ExploreComponent,
    resolve: {
      menu: menuActiveResolverFn
    },
    data: {
      menu: MenuType.EXPLORE
    }
  },

  {
    path: 'messages',
    component: MessagesComponent,
    resolve: {
      menu: menuActiveResolverFn
    },
    data: {
      menu: MenuType.MESSAGES
    }
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
