import { Component, OnInit } from '@angular/core';

import {Movie} from '../model/movie';
import {PopcornApiService} from '../services/popcorn-api.service';

@Component({
  selector: 'tv-container',
  templateUrl: './tv-container.component.html',
  styleUrls: ['./tv-container.component.css']
})
export class TvContainerComponent implements OnInit {
series: Movie[] = [];
  selectedMovie: Movie;
  vDetails: boolean = false;
  constructor(private svc: PopcornApiService) { }

  ngOnInit() {
    this.svc.getAllSeries().subscribe(
      data => {
        this.series = data;
        this.selectedMovie = data[0];
      }
    )
  }

  viewDetails(movie: Movie) {
    this.selectedMovie = movie;
    this.vDetails = true;
  }

  toggleView() {
    this.vDetails = false;
  }

}
