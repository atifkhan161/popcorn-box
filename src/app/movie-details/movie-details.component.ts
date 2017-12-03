import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import * as webtorrent from 'webtorrent';
import { _ } from 'underscore';
import videojs from 'video.js';

import { Movie } from '../model/movie.trakt';
import { Source } from '../model/sources';

import { sourcesService } from '../services/sources.service';

@Component({
  selector: 'movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit, OnChanges {
  @Input() movie: Movie;
  @Output() closeView = new EventEmitter<boolean>();
  player: any;
  client: webtorrent;
  isThumbnail: boolean;
  sources: Source[];
  streamResult: any;
  constructor(private sourcesService: sourcesService, private elRef: ElementRef) { }

  ngOnInit() {
    if (this.client) {
      this.client.destroy();
    }
    this.isThumbnail = true;
    this.client = new webtorrent();
    this.sources = [];
    //Load sources
    this.loadSources();

    // this.player = this.elRef.nativeElement.querySelector('.popcorn-box-player');
    // setup the player via the unique element ID
    this.player = videojs(document.getElementsByClassName('popcorn-box-player')[0], {}, function () {

      // Store the video object
      var myPlayer = this, id = myPlayer.id();

      // Make up an aspect ratio
      var aspectRatio = 264 / 640;

      // internal method to handle a window resize event to adjust the video player
      function resizeVideoJS() {
        var width = document.getElementById(id).parentElement.offsetWidth;
        myPlayer.width(width - 10);
        myPlayer.height(document.getElementById(id).parentElement.offsetHeight);
      }

      // Initialize resizeVideoJS()
      resizeVideoJS();

      // Then on resize call resizeVideoJS()
      window.onresize = resizeVideoJS;
    });
    //Register events
    this.player.ready(function () {
      // Store the video object
      var myPlayer = this;
      // get
      var howLoudIsIt = myPlayer.volume();
      // set
      // myPlayer.volume(0.5); // Set volume to half
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['movie'].previousValue && changes['movie'].previousValue != changes['movie'].currentValue) {
      this.isThumbnail = true;
      this.client = new webtorrent();
      this.sources = [];
      //Load sources
      this.loadSources();
    }
  }

  cView() {
    this.closeView.emit();
    this.client.destroy();
  }

  watch(source: Source) {
    this.isThumbnail = false;
    this.client = new webtorrent();
    this.client.add(source.url, torrent => {
      // Torrents can contain many files. Let's use the .mp4 file
      var file = torrent.files.find(function (file) {
        return file.name.endsWith('.mp4')
      });
      if (file) {
        file.renderTo('.popcorn-box-player video');
      }
    });
  }
  loadSources() {
    //Popcorn Sources
    this.sourcesService.getYifyMovieSources(this.movie.ids.imdb).subscribe(res => {
      this.sources = res["torrents"];
    });

    this.refreshStream();
  }
  refreshStream() {
    //Streams
    this.streamResult = [];
    this.sourcesService.getMovieStreams(this.movie).subscribe(res => {
      this.streamResult = res;
    });
  }
  watchStream(watchStream) {
    if (!this.client.destroyed) {
      this.client.destroy();
    }
    this.player.src(watchStream.file);
    this.player.play();
  }

  ngOnDestroy() {
    if (!this.client.destroyed) {
      this.client.destroy();
    }
  }
}
