import {    
  Component,
  OnInit,
  OnDestroy,
  ElementRef,
  Input
} from '@angular/core';

//declare function videojs(id: any, options: any, ready:any): any;

import videojs from 'video.js';

@Component({
  selector: 'videojs',
  template: `
  <video id="video_{{idx}}"
     class="video-js vjs-default-skin vjs-big-play-centered vjs-16-9"
     controls preload="auto"  width="640" height="264">
     
    <source [src]="url" type="video/mp4" />
   
  </video>
  `,
})

export class VideoJSComponent implements OnInit {
  
  // reference to the element itself, we use this to access events and methods
  private _elementRef: ElementRef

  // index to create unique ID for component
  @Input() idx: string;
  
  // video asset url
  @Input() url: any;

  // declare player var
  private player: any; 

  // constructor initializes our declared vars
  constructor(elementRef: ElementRef) {
    this.url = false;
    this.player = false;
  }

  ngOnInit() { }

  // use ngAfterViewInit to make sure we initialize the videojs element
  // after the component template itself has been rendered
  ngAfterViewInit() {
    
    // ID with which to access the template's video element
    let el = 'video_' + this.idx;
    
    // setup the player via the unique element ID
    this.player = videojs(document.getElementById(el), {}, function() {
      
      // Store the video object
      var myPlayer = this, id = myPlayer.id();
      
      // Make up an aspect ratio
      var aspectRatio = 264/640;
      
      // internal method to handle a window resize event to adjust the video player
      function resizeVideoJS(){
        var width = document.getElementById(id).parentElement.offsetWidth;
        myPlayer.width(width);
        myPlayer.height( width * aspectRatio );
      }
      
      // Initialize resizeVideoJS()
      resizeVideoJS();
      
      // Then on resize call resizeVideoJS()
      window.onresize = resizeVideoJS;
    });
  }

}