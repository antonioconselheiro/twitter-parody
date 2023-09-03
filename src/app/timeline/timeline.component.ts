import { Component, OnInit } from '@angular/core';
import { AbstractEntitledComponent } from '../shared/abstract-entitled/abstract-entitled.component';

@Component({
  selector: 'tw-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent extends AbstractEntitledComponent implements OnInit {
  title = 'Home';


}
