import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { menuActiveResolverFn } from '@shared/menu-sidebar/menu-active.resolve-fn';
import { MenuType } from '@shared/menu-sidebar/menu-type.enum';
import { AppRoutingMatcher } from './app-routing.matcher';
import { BookmarksPageComponent } from './pages/bookmarks-page/bookmarks-page.component';
import { CommunitiesPageComponent } from './pages/communities-page/communities-page.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { neventResolveFn } from './shared/resolve/nevent-resolve-fn';
import { noteResolveFn } from './shared/resolve/note.resolve-fn';
import { ExplorePageComponent } from './pages/explore-page/explore-page.component';
import { ListsPageComponent } from './pages/lists-page/lists-page.component';
import { MessagesPageComponent } from './pages/messages-page/messages-page.component';
import { NotificationsPageComponent } from './pages/notifications-page/notifications-page.component';
import { nip05ResolveFn } from './shared/resolve/nip05.resolve-fn';
import { nprofileResolveFn } from './shared/resolve/nprofile.resolve-fn';
import { npubResolveFn } from './shared/resolve/npub.resolve-fn';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { TimelineComponent } from './pages/timeline-page/timeline-page.component';

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
    matcher: consumed => AppRoutingMatcher.nip05RoutingMatch(consumed),
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
    matcher: consumed => AppRoutingMatcher.routingMatch(consumed, 'nprofile'),
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
    matcher: consumed => AppRoutingMatcher.routingMatch(consumed, 'npub'),
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
    matcher: consumed => AppRoutingMatcher.routingMatch(consumed, 'nevent'),
    component: EventPageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      event: neventResolveFn
    }
  },

  {
    matcher: consumed => AppRoutingMatcher.routingMatch(consumed, 'note'),
    component: EventPageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      event: noteResolveFn
    }
  },

  {
    matcher: consumed => AppRoutingMatcher.imageViewingRoutingMatch(consumed, 'nprofile', 'nevent'),
    component: ProfilePageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: nprofileResolveFn,
      event: neventResolveFn
    }
  },

  {
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
    matcher: consumed => AppRoutingMatcher.imageViewingRoutingMatch(consumed, 'npub', 'nevent'),
    component: EventPageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: npubResolveFn,
      event: neventResolveFn
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
    matcher: consumed => AppRoutingMatcher.nip05ImageViewingRoutingMatch(consumed, 'nevent'),
    component: ProfilePageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: nip05ResolveFn,
      event: neventResolveFn
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
