import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { MessagesModule } from './messages/messages.module';
import { NetworkModule } from './network/network.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TimelineModule } from './timeline/timeline.module';

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
    MessagesModule
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
