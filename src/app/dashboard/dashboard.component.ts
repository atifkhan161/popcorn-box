import { Component, OnInit } from '@angular/core';

import {traktService } from '../services/trakt.services';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [traktService]
})
export class DashboardComponent implements OnInit {
  isAuthenticated : boolean;
  deviceCode: string;
  verificationUrl:string;
  constructor(private trakt: traktService) { }

  ngOnInit() {
    this.isAuthenticated = false;
    this.trakt.generateDeviceCode().subscribe(
      data => {
        this.deviceCode = data["user_code"];
        this.verificationUrl = data["verification_url"];

      }
    )
  }

}
