import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { menuActiveResolverFn } from '@shared/menu-sidebar/menu-active.resolve-fn';
import { MenuType } from '@shared/menu-sidebar/menu-type.enum';
import { neventAccountResolveFn } from '@shared/resolve/nevent-account.resolve-fn';
import { AppRoutingMatcher } from './app-routing.matcher';
import { BookmarksPageComponent } from './pages/bookmarks-page/bookmarks-page.component';
import { CommunitiesPageComponent } from './pages/communities-page/communities-page.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { ExplorePageComponent } from './pages/explore-page/explore-page.component';
import { ListsPageComponent } from './pages/lists-page/lists-page.component';
import { MessagesPageComponent } from './pages/messages-page/messages-page.component';
import { NotificationsPageComponent } from './pages/notifications-page/notifications-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { TimelineComponent } from './pages/timeline-page/timeline-page.component';
import { neventResolveFn } from './shared/resolve/nevent.resolve-fn';
import { nip05ResolveFn } from './shared/resolve/nip05.resolve-fn';
import { noteResolveFn } from './shared/resolve/note.resolve-fn';
import { nprofileResolveFn } from './shared/resolve/nprofile.resolve-fn';
import { npubResolveFn } from './shared/resolve/npub.resolve-fn';

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
      account: npubResolveFn,
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
          event: neventResolveFn
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
    matcher: consumed => AppRoutingMatcher.routingMatchNip05(consumed),
    component: ProfilePageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: nip05ResolveFn
    }
  },

  {
    matcher: consumed => AppRoutingMatcher.routingMatchNprofile(consumed),
    component: ProfilePageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: nprofileResolveFn
    }
  },

  {
    matcher: consumed => AppRoutingMatcher.routingMatchNpub(consumed),
    component: ProfilePageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: npubResolveFn
    }
  },

  {
    matcher: consumed => AppRoutingMatcher.routingMatchNevent(consumed),
    component: EventPageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: neventAccountResolveFn,
      event: neventResolveFn
    }
  },

  {
    matcher: consumed => AppRoutingMatcher.routingMatchNote(consumed),
    component: EventPageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      event: noteResolveFn
    }
  },

  /**{
    matcher: consumed => AppRoutingMatcher.imageViewingRoutingMatch(consumed, 'nprofile', 'note'),
    component: ProfilePageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: nprofileResolveFn,
      event: noteResolveFn
    }
  },

  {
    matcher: consumed => AppRoutingMatcher.imageViewingRoutingMatch(consumed, 'npub', 'note'),
    component: ProfilePageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: npubResolveFn,
      event: noteResolveFn
    }
  },

  {
    matcher: consumed => AppRoutingMatcher.nip05ImageViewingRoutingMatch(consumed, 'note'),
    component: ProfilePageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: nip05ResolveFn,
      event: noteResolveFn
    }
  }, */

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
