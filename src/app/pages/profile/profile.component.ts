import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ITweet } from '@domain/tweet.interface';
import { IProfile } from '@shared/profile-service/profile.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tw-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  profile: IProfile | null = null;
  tweets: ITweet[] = [];

  constructor(
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.tweets = this.activatedRoute.snapshot.data['tweets'];
    this.profile = this.activatedRoute.snapshot.data['profile'];
  }
}
