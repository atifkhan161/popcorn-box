import { Component, OnInit } from '@angular/core';

import { traktService } from '../services/trakt.services';
import { ytsService } from '../services/yts.service';
import { Movie } from 'app/model/movie.trakt';
import { Show } from 'app/model/show.trakt';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  selectedShow: Show;
  NextToWatchShows: any;
  selectedMovie: Movie;
  isAuthenticated: boolean;
  deviceCode: string;
  verificationUrl: string;
  ytsMovies: Movie[];
  traktWatchlist: Movie[] = [];
  traktRecommendation: Movie[] = [];
  constructor(private trakt: traktService, private yts: ytsService) { }

  ngOnInit() {
    this.isAuthenticated = false;
    let self = this;
    this.getDeviceCode();
  }
  getDeviceCode() {
    this.trakt.generateDeviceCode().subscribe(resp => {
      if (resp.authenticated) {
        this.isAuthenticated = true;
        this.fetchDashboardList();
      }
      else {
        this.deviceCode = resp.user_code;
        this.trakt.pollAccessToken(resp).subscribe(resp => {
          this.isAuthenticated = true;
        });
        this.fetchDashboardList();
      }
    });
  }
  fetchDashboardList(){
    this.trakt.getWatchlistMovies().subscribe(resp =>{
      this.traktWatchlist = resp;
    });
    this.trakt.getRecommendationsMovies().subscribe(resp =>{
      this.traktRecommendation = resp;
    });
    
    this.trakt.getNextToWatchShows().subscribe(resp =>{
      this.NextToWatchShows = resp;
    });
  }

  viewDetails(movie: Movie, show: Show) {
    if (movie){
      this.selectedMovie = movie;
      this.trakt.setSelectedMovie(movie);
    }
    else {
      this.selectedShow = show;
      this.trakt.setSelectedShow(show);
    }
  }

}
