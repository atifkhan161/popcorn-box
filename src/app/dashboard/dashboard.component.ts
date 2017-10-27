import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  constructor() { }

  ngOnInit() {
    // let options = {
    //   client_id: '42ee8abf7aa0c5c2d275a81877a323dafe105b821dec2785f848bd3d9bf7ccb7',
    //   client_secret: '37c4043b6481b17fd95f8f7cacec18ad21c907296458cbeabfefc824de8b148d',
    //   redirect_uri: null,   // defaults to 'urn:ietf:wg:oauth:2.0:oob'
    //   api_url: null,        // defaults to 'https://api.trakt.tv'
    //   useragent: null,      // defaults to 'trakt.tv/<version>'
    //   pagination: true      // defaults to false, global pagination (see below)
    // };
    
    // this.trakt.exchange_code('code', 'csrf token (state)').then(result => {
    //   // contains tokens & session information
    //   // API can now be used with authorized requests
    // });
    // this.trakt.get_codes().then(poll => {
    //   // poll.verification_url: url to visit in a browser
    //   // poll.user_code: the code the user needs to enter on trakt

    //   // verify if app was authorized
    //   return this.trakt.poll_access(poll);
    // }).catch(error => {
    //   // error.message == 'Expired' will be thrown if timeout is reached
    // });
  }

}
