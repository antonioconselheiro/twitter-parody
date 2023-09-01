import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { ExploreModule } from './explore/explore.module';
import { MessagesModule } from './messages/messages.module';
import { NetworkModule } from './network/network.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ExploreSidebarModule } from './shared/explore-sidebar/explore-sidebar.module';
import { MenuSidebarModule } from './shared/menu-sidebar/menu-sidebar.module';
import { TimelineModule } from './timeline/timeline.module';
import { UtilModule } from '@shared/util/util.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    // pathed components
    TimelineModule,
    NotificationsModule,
    BookmarksModule,
    NetworkModule,
    MessagesModule,
    ExploreModule,

    //  shared
    MenuSidebarModule,
    ExploreSidebarModule,
    UtilModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
