import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from '@belomonte/async-modal-ngx';
import { CredentialHandlerService } from '@belomonte/nostr-gui-ngx';
import { AuthenticatedAccountObservable } from '@belomonte/nostr-ngx';
import { PopoverComponent } from '@shared/popover-widget/popover.component';
import { CompositeTweetPopoverComponent } from '@shared/tweet-widget/composite-tweet-popover/composite-tweet-popover.component';
import { Subscription } from 'rxjs';
import { MenuActiveObservable } from '../menu-active.observable';
import { MenuType } from '../menu-type.enum';
import { NostrMetadata } from '@nostrify/nostrify';

@Component({
  selector: 'tw-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss']
})
export class MenuSidebarComponent implements OnInit, OnDestroy {

  private subscriptions = new Subscription();

  readonly MENU_TYPE_HOME = MenuType.HOME;
  readonly MENU_TYPE_EXPLORE = MenuType.EXPLORE;
  readonly MENU_TYPE_NOTIFICATIONS = MenuType.NOTIFICATIONS;
  readonly MENU_TYPE_MESSAGES = MenuType.MESSAGES;
  readonly MENU_TYPE_LISTS = MenuType.LISTS;
  readonly MENU_TYPE_BOOKMARKS = MenuType.BOOKMARKS;
  readonly MENU_TYPE_COMMUNITIES = MenuType.COMMUNITIES;
  readonly MENU_TYPE_PROFILE = MenuType.PROFILE;

  profile: NostrMetadata | null = null;
  menuActive: MenuType | null = null;
  
  @ViewChild('authPopover', { read: PopoverComponent })
  popover!: PopoverComponent;

  constructor(
    private modalService: ModalService,
    private profile$: AuthenticatedAccountObservable,
    private menuActive$: MenuActiveObservable,
    private credentialHandlerService: CredentialHandlerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.bindProfileSubscription();
    this.bindMenuActiveSubscription();
  }

  private bindProfileSubscription(): void {
    this.subscriptions.add(this.profile$.subscribe(
      profile => this.profile = profile
    ));
  }

  private bindMenuActiveSubscription(): void {
    this.subscriptions.add(this.menuActive$.subscribe(
      menu => this.menuActive = menu
    ));
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onProfileMenuClick(profile: NostrMetadata | null): void {
    if (profile) {
      this.popover.show();
    } else {
      this.credentialHandlerService.addAccount();
    }
  }

  addExistingAccount(e: Event): void {
    e.stopPropagation();

    this.credentialHandlerService.addAccount();
    this.popover.hide();
  }

  logout(e: Event): void {
    e.stopPropagation();

    this.profile$.logout();
    this.popover.hide();
  }

  openTweetCompose(): void {
    this.modalService
      .createModal(CompositeTweetPopoverComponent)
      .setBindToRoute(this.router)
      .build();
  }
}
