import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookmarksPageComponent } from './pages/bookmarks-page/bookmarks-page.component';
import { ExplorePageComponent } from './pages/explore-page/explore-page.component';
import { ListsPageComponent } from './pages/lists-page/lists-page.component';
import { MessagesPageComponent } from './pages/messages-page/messages-page.component';
import { NotificationsPageComponent } from './pages/notifications-page/notifications-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { TimelineComponent } from './pages/timeline-page/timeline-page.component';
import { profileResolverFn } from './pages/profile-page/profile.resolve-fn';
import { menuActiveResolverFn } from '@shared/menu-sidebar/menu-active.resolve-fn';
import { MenuType } from '@shared/menu-sidebar/menu-type.enum';
import { CommunitiesPageComponent } from './pages/communities-page/communities-page.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { eventResolverFn } from './pages/event-page/event-resolve-fn';

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
    component: BookmarksPageComponent,
    resolve: {
      menu: menuActiveResolverFn
    },
    data: {
      menu: MenuType.BOOKMARKS
    }
  },

  {
    path: 'communities',
    component: CommunitiesPageComponent,
    resolve: {
      menu: menuActiveResolverFn
    },
    data: {
      menu: MenuType.COMMUNITIES
    }
  },

  {
    path: 'lists',
    component: ListsPageComponent,
    resolve: {
      menu: menuActiveResolverFn
    },
    data: {
      menu: MenuType.LISTS
    }
  },

  {
    path: 'p/:npub',
    component: ProfilePageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    resolve: {
      account: profileResolverFn,
      menu: menuActiveResolverFn
    },
    data: {
      menu: MenuType.PROFILE
    },
    children: [
      {
        path: 'e/:nevent',
        component: EventPageComponent,
        runGuardsAndResolvers: 'pathParamsChange',
        resolve: {
          event: eventResolverFn
        }
      }
    ]
  },

  {
    path: 'e/:nevent',
    component: EventPageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    resolve: {
      menu: menuActiveResolverFn
    },
    data: {
      menu: null
    }
  },

  {
    path: 'notifications',
    component: NotificationsPageComponent,
    resolve: {
      menu: menuActiveResolverFn
    },
    data: {
      menu: MenuType.NOTIFICATIONS
    }
  },

  {
    path: 'explore',
    component: ExplorePageComponent,
    resolve: {
      menu: menuActiveResolverFn
    },
    data: {
      menu: MenuType.EXPLORE
    }
  },

  {
    path: 'messages',
    component: MessagesPageComponent,
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
