import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import * as webtorrent from 'webtorrent';
import { _ } from 'underscore';
import {SlimLoadingBarService} from 'ng2-slim-loading-bar';

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
  constructor(private sourcesService: sourcesService, private elRef: ElementRef, private slimLoadingBarService: SlimLoadingBarService) { }

  ngOnInit() {
    if (this.client) {
      this.client.destroy();
    }
    this.isThumbnail = true;
    this.client = new webtorrent();
    this.sources = [];
    //Load sources
    this.loadSources();

    this.player = this.elRef.nativeElement.querySelector('.popcorn-box-player');
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
    this.client.add(source.url, this.fetchSuccess);
  }
  fetchSuccess(torrent) {
    // Torrents can contain many files. Let's use the .mp4 file
    var file = torrent.files.find(function (file) {
      return file.name.endsWith('.mp4')
    });
    if (file) {
      file.renderTo('video#popcorn-box-player');
    }
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
    this.slimLoadingBarService.start();
    this.streamResult = [];
    this.sourcesService.getMovieStreams(this.movie).subscribe(res => {
      this.streamResult.push({
        "file": "https://storage.googleapis.com/glassy-courage-186317.appspot.com/jax/20.11.17/A01/Valerian.and.the.City.of.a.Thousand.Planets.2017.720p.KORSUB.HDRip.x264.AAC2.0-STUTTERSHIT.mp4",
        "type": "mp4"
      });
      this.streamResult = res;
      this.slimLoadingBarService.complete();      
    });
  }
  watchStream(watchStream) {
    this.isThumbnail = false;
    let s = document.createElement("source");
    s.type = watchStream.type;
    s.src = watchStream.file;
    this.player.appendChild(s);
    this.player.play();
  }

  ngOnDestroy() {
    if (!this.client.destroyed) {
      this.client.destroy();
    }
  }
}
