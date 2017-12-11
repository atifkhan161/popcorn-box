import { Component, OnInit } from '@angular/core';

import { traktService } from '../services/trakt.services';
import { ytsService } from '../services/yts.service';
import { Movie } from '../model/movie';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isAuthenticated: boolean;
  deviceCode: string;
  verificationUrl: string;
  ytsMovies: Movie[];
  traktWatchlist: Movie[] = [];
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
  }

}
