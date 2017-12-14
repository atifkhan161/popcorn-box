import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import * as webtorrent from 'webtorrent';
import { _ } from 'underscore';
import videojs from 'video.js';

import { Movie } from '../model/movie.trakt';
import { Source } from '../model/sources';

import { sourcesService } from '../services/sources.service';
import { Observable } from 'rxjs/Observable';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { EmbedSourceModelComponent } from 'app/embed-source-model/embed-source-model.component';
import { traktService } from 'app/services/trakt.services';

@Component({
  selector: 'movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit, OnChanges {
  movieBackground: string = "";
  movie: Movie;
  // @Output() closeView = new EventEmitter<boolean>();
  player: any;
  client: webtorrent;
  isThumbnail: boolean;
  sources: Source[];
  streamResult: any;
  socket: any;
  public modalRef: BsModalRef;
  constructor(private sourcesService: sourcesService, private elRef: ElementRef, 
              private modalService: BsModalService, public sanitizer: DomSanitizer,
              private trakt: traktService) { }

  ngOnInit() {
    if (this.client) {
      this.client.destroy();
    }
    this.isThumbnail = true;
    this.client = new webtorrent();
    this.sources = [];
    
    //Fetch movie object
    this.movie = this.trakt.getSelectedMovie();

    this.movieBackground = this.movie.moviebackground ? this.movie.moviebackground[0]['url']: this.movie.movieposter[0]['url'];

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
    // this.closeView.emit();
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
      res.forEach(src => {
       this.streamResult.push(src);      
      });
    });
  }
  watchStream(watchStream) {
    if (!this.client.destroyed) {
      this.client.destroy();
    }
    if(watchStream.embed){
      this.modalRef = this.modalService.show(EmbedSourceModelComponent, {class: 'modal-lg', backdrop: 'static'});
      this.modalRef.content.linkUrl = this.sanitizer.bypassSecurityTrustResourceUrl(watchStream.file);
      this.modalRef.content.titleifr = watchStream.type;
    }
    else{
      this.player.src(watchStream.file);
      this.player.play();
    }
  }

  ngOnDestroy() {
    if (!this.client.destroyed) {
      this.client.destroy();
    }
  }
}
