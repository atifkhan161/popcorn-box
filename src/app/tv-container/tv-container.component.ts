import { Component, OnInit } from '@angular/core';
import { Show } from '../model/show.trakt';
import { keyValue } from '../model/key-value';
import { traktService } from '../services/trakt.services';

@Component({
  selector: 'tv-container',
  templateUrl: './tv-container.component.html',
  styleUrls: ['./tv-container.component.css']
})
export class TvContainerComponent implements OnInit {
  shows: Show[] = [];
  selectedShow: Show;
  vDetails: boolean = false;
  listBy: string;
  searchQuery: string;
  selectLists: keyValue[];
  constructor(private trakt: traktService) { }

  ngOnInit() {
    this.listBy = "popular";
    this.selectLists = [];
    this.selectLists.push(new keyValue("trending","trending"));
    this.selectLists.push(new keyValue("popular","popular"));
    this.selectLists.push(new keyValue("played","played"));
    this.selectLists.push(new keyValue("watched","watched"));
    this.selectLists.push(new keyValue("collected","collected"));
    this.trakt.getShows(this.listBy).subscribe(resp => {
      this.shows = resp;
      this.selectedShow = resp[0];
      this.trakt.setSelectedShow(this.selectedShow);
    });
  }

  viewDetails(show: Show) {
    this.selectedShow = show;
    this.trakt.setSelectedShow(show);
  }

  toggleView() {
    this.vDetails = false;
  }
  onlistChange() {
    this.trakt.getShows(this.listBy).subscribe(resp => {
      this.shows = resp;
      this.selectedShow = resp[0];
    });
  }
  search() {
    if (this.searchQuery) {
      this.trakt.searchShows(this.searchQuery).subscribe(resp => {
        this.shows = resp;
        this.selectedShow = resp[0];
      });
    }
  }
}
