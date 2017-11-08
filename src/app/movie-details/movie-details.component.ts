import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import * as webtorrent from 'webtorrent';
import { _ } from 'underscore';
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
  @ViewChild('Popcornplayer') player: ElementRef;

  client: webtorrent;
  isThumbnail: boolean;
  sources: Source[];
  constructor(private sourcesService: sourcesService) { }

  ngOnInit() {
    if (this.client) {
      this.client.destroy();
    }
    this.isThumbnail = true;
    this.client = new webtorrent();
    this.sources = [];
    //Load sources
    this.loadSources();
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
    this.sourcesService.getYifyMovieSources(this.movie.ids.imdb).subscribe(res => {
      this.sources = res["torrents"];
    });
  }

  ngOnDestroy() {
    this.client.destroy();
  }
}
