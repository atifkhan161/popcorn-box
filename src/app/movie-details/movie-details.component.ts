import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import {Movie} from '../model/movie';

@Component({
  selector: 'movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit, OnChanges {
@Input() movie: Movie;
@Output() closeView = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit() {
    this.movie.rating.stars = this.movie.rating.percentage / 20;
  }
  ngOnChanges(changes) {
      this.movie.rating.stars = this.movie.rating.percentage / 20;
  }

  cView () {
    this.closeView.emit();
  }
  
}
