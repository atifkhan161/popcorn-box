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
  constructor(private trakt: traktService, private yts: ytsService) { }

  ngOnInit() {
    this.isAuthenticated = false;
    let self = this;
    // this.trakt.getTrendingMovies().subscribe(resp => {
    //   console.log(resp);
    // });
  }

}
