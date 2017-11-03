import { Component, OnInit } from '@angular/core';
import { Movie } from '../model/movie';
import { ShowsApiService } from '../services/showapiservices';

@Component({
  selector: 'tv-container',
  templateUrl: './tv-container.component.html',
  styleUrls: ['./tv-container.component.css'],
  providers: [ShowsApiService]
})
export class TvContainerComponent implements OnInit {
  shows: Movie[] = [];
  selectedShow: Movie;
  vDetails: boolean = false;
  constructor(private svc: ShowsApiService) { }

  ngOnInit() {
    this.svc.getAllShows().subscribe(
      data => {
        this.shows = data;
        this.selectedShow = data[0];
      }
    )
  }

  viewDetails(movie: Movie) {
    this.selectedShow = movie;
    this.vDetails = true;
  }

  toggleView() {
    this.vDetails = false;
  }
}
