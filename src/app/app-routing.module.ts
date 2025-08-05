import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { menuActiveResolverFn } from '@shared/menu-sidebar/menu-active.resolve-fn';
import { MenuType } from '@shared/menu-sidebar/menu-type.enum';
import { AppRoutingMatcher } from './app-routing.matcher';
import { BookmarksPageComponent } from './pages/bookmarks-page/bookmarks-page.component';
import { CommunitiesPageComponent } from './pages/communities-page/communities-page.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { neventResolverFn } from './pages/event-page/nevent-resolve-fn';
import { noteResolverFn } from './pages/event-page/note.resolve-fn';
import { ExplorePageComponent } from './pages/explore-page/explore-page.component';
import { ListsPageComponent } from './pages/lists-page/lists-page.component';
import { MessagesPageComponent } from './pages/messages-page/messages-page.component';
import { NotificationsPageComponent } from './pages/notifications-page/notifications-page.component';
import { nip05ResolverFn } from './pages/profile-page/nip05.resolver-fn';
import { nprofileResolverFn } from './pages/profile-page/nprofile.resolve-fn';
import { npubResolverFn } from './pages/profile-page/npub.resolve-fn';
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
      account: npubResolverFn,
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
          event: neventResolverFn
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
      account: nip05ResolverFn
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
      account: nprofileResolverFn
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
      account: npubResolverFn
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
      event: neventResolverFn
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
      event: noteResolverFn
    }
  },

  {
    matcher: consumed => AppRoutingMatcher.profileEventRoutingMatch(consumed, 'nprofile', 'nevent'),
    component: EventPageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: nprofileResolverFn,
      event: neventResolverFn
    }
  },

  {
    matcher: consumed => AppRoutingMatcher.profileEventRoutingMatch(consumed, 'nprofile', 'note'),
    component: EventPageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: nprofileResolverFn,
      event: noteResolverFn
    }
  },

  {
    matcher: consumed => AppRoutingMatcher.profileEventRoutingMatch(consumed, 'npub', 'nevent'),
    component: EventPageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: npubResolverFn,
      event: neventResolverFn
    }
  },

  {
    matcher: consumed => AppRoutingMatcher.profileEventRoutingMatch(consumed, 'npub', 'note'),
    component: EventPageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: npubResolverFn,
      event: noteResolverFn
    }
  },

  {
    matcher: consumed => AppRoutingMatcher.nip05ProfileEventRoutingMatch(consumed, 'nevent'),
    component: EventPageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: nip05ResolverFn,
      event: neventResolverFn
    }
  },

  {
    matcher: consumed => AppRoutingMatcher.nip05ProfileEventRoutingMatch(consumed, 'note'),
    component: EventPageComponent,
    runGuardsAndResolvers: 'pathParamsChange',
    data: {
      menu: null
    },
    resolve: {
      account: nip05ResolverFn,
      event: noteResolverFn
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
