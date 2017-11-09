import { Component, OnInit } from '@angular/core';

import { traktService } from '../services/trakt.services';
import { Show } from '../model/show.trakt';
@Component({
  selector: 'show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.css']
})
export class ShowDetailsComponent implements OnInit {
  show: Show;

  constructor(private trakt: traktService) { }

  ngOnInit() {
    this.show = this.trakt.getSelectedShow();
  }

}
