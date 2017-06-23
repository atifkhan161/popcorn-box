import { Component } from '@angular/core';
import { TabsetComponent } from 'ngx-bootstrap';

declare var SimpleWebRTC: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';

  webrtc = new SimpleWebRTC({
    // the id/element dom element that will hold "our" video
    localVideoEl: 'localVideo',
    // the id/element dom element that will hold remote videos
    remoteVideosEl: 'remoteVideos',
    // immediately ask for camera access
    autoRequestMedia: true
}).on('readyToCall', function () {
    // you can name it anything
    this.webrtc.joinRoom('room1');
});
}
