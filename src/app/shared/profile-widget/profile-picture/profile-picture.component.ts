import { Component, Input } from '@angular/core';

@Component({
  selector: 'tw-profile-picture',
  templateUrl: './profile-picture.component.html',
  styleUrls: ['./profile-picture.component.scss']
})
export class ProfilePictureComponent {

  private readonly defaultPicture = '/assets/profile/default-profile.png'; 

  @Input()
  tabindex?: number;

  @Input()
  set picture(pic: string | undefined) {
    this.interceptedPicture = pic || this.defaultPicture;
  }

  get picture(): string | undefined {
    return this.interceptedPicture || this.defaultPicture;
  }

  interceptedPicture = this.defaultPicture;
}
