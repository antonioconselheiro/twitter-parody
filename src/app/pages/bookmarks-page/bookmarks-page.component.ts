import { Component } from '@angular/core';
import { AbstractEntitledComponent } from '@shared/abstract-entitled/abstract-entitled.component';

@Component({
  selector: 'tw-bookmarks-page',
  templateUrl: './bookmarks-page.component.html',
  styleUrls: ['./bookmarks-page.component.scss']
})
export class BookmarksPageComponent extends AbstractEntitledComponent {
  override title = 'Bookmarks';
}
