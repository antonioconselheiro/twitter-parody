import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ApiServiceModule } from '@shared/api-service/api-service.module';
import { CameraModule } from '@shared/camera/camera.module';
import { FloatingChatModule } from '@shared/floating-chat/floating-chat.module';
import { HtmlfyServiceModule } from '@shared/htmlfy/htmlfy-service.module';
import { LoadingWidgetModule } from '@shared/loading/loading-widget.module';
import { MainErrorModule } from '@shared/main-error/main-error.module';
import { ModalModule } from '@shared/modal/modal.module';
import { ProfileServiceModule } from '@shared/profile-service/profile-service.module';
import { SecurityServiceModule } from '@shared/security-service/security-service.module';
import { ThemeModule } from '@shared/theme/theme.module';
import { TweetServiceModule } from '@shared/tweet-service/tweet-service.module';
import { UtilModule } from '@shared/util/util.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookmarksModule } from './pages/bookmarks/bookmarks.module';
import { CommunitiesModule } from './pages/communities/communities.module';
import { ExploreModule } from './pages/explore/explore.module';
import { ListsModule } from './pages/lists/lists.module';
import { MessagesModule } from './pages/messages/messages.module';
import { NetworkModule } from './pages/network/network.module';
import { NotificationsModule } from './pages/notifications/notifications.module';
import { ProfileModule } from './pages/profile/profile.module';
import { TimelineModule } from './pages/timeline/timeline.module';
import { ExploreSidebarModule } from './shared/explore-sidebar/explore-sidebar.module';
import { MenuSidebarModule } from './shared/menu-sidebar/menu-sidebar.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    // pages eager loaded module
    TimelineModule,
    NotificationsModule,
    BookmarksModule,
    NetworkModule,
    MessagesModule,
    ExploreModule,
    ProfileModule,
    ListsModule,
    CommunitiesModule,

    //  shared service module
    UtilModule,
    MainErrorModule,
    ApiServiceModule,
    SecurityServiceModule,
    ProfileServiceModule,
    TweetServiceModule,
    HtmlfyServiceModule,

    //  widgets
    CameraModule,
    MenuSidebarModule,
    ExploreSidebarModule,
    LoadingWidgetModule,
    ThemeModule,
    FloatingChatModule,
    ModalModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
