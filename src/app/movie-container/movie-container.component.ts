import { Component, OnInit } from '@angular/core';
import { Movie } from '../model/movie.trakt';
import { keyValue } from '../model/key-value';
import { MovieApiService } from '../services/movieapiservice';
import { traktService } from '../services/trakt.services';

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
  listBy: string;
  searchQuery: string;
  selectLists: keyValue[];
  constructor(private svc: MovieApiService, private trakt: traktService) { }

  ngOnInit() {
    this.listBy = "popular";
    this.selectLists = [];
    this.selectLists.push(new keyValue("trending","trending"));
    this.selectLists.push(new keyValue("popular","popular"));
    this.selectLists.push(new keyValue("played","played"));
    this.selectLists.push(new keyValue("watched","watched"));
    this.selectLists.push(new keyValue("collected","collected"));
    this.trakt.getMovies(this.listBy).subscribe(resp => {
      this.movies = resp;
      this.selectedMovie = resp[0];
    });
  }

  viewDetails(movie: Movie) {
    this.selectedMovie = movie;
    this.vDetails = true;
  }

  toggleView() {
    this.vDetails = false;
  }
  onlistChange() {
    this.trakt.getMovies(this.listBy).subscribe(resp => {
      this.movies = resp;
      this.selectedMovie = resp[0];
    });
  }
  search() {
    if (this.searchQuery) {
      this.trakt.searchMovies(this.searchQuery).subscribe(resp => {
        this.movies = resp;
        this.selectedMovie = resp[0];
      });
    }
  }
}
