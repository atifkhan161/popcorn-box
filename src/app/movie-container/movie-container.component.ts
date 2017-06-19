import { Component, OnInit } from '@angular/core';
import {Movie} from '../model/movie';
import {MovieApiService} from '../services/movieapiservice';

@Component({
  selector: 'movie-container',
  templateUrl: './movie-container.component.html',
  styleUrls: ['./movie-container.component.css'],
  providers: [MovieApiService]
})
export class MovieContainerComponent implements OnInit {
  movies: Movie[] = [];
  selectedMovie: Movie;
  vDetails: boolean = false;
  constructor(private svc: MovieApiService) { }

  ngOnInit() {
    this.svc.getAllMovies().subscribe(
      data => {
        this.movies = data;
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
