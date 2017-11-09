import { Injectable } from '@angular/core';

import { Movie } from '../model/movie.trakt';
import { Show } from '../model/show.trakt';
@Injectable() 
export class AppStorageService {
  selectedShow: Show;
  selectedMovie: Movie;
}