import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import * as webtorrent from 'webtorrent';
import { plainToClass } from "class-transformer";

import { Movie } from '../model/movie';
import { Source } from '../model/sources';


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
  constructor() { }

  ngOnInit() {
    this.isThumbnail = true;
    this.movie.rating.stars = this.movie.rating.percentage / 20;
    this.client = new webtorrent();
    this.sources = [];
    //Load sources
    this.loadSources();
  }
  ngOnChanges(changes) {
    this.movie.rating.stars = this.movie.rating.percentage / 20;
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
    var quality = this.movie.torrents["en"];
    let fullHd = new Source();
    fullHd.fillFromJSON(quality["1080p"]);
    fullHd.quality = "1080p";
    this.sources.push(fullHd);
    let Hd = new Source();
    Hd.fillFromJSON(quality["720p"]);
    Hd.quality = "720p";
    this.sources.push(Hd);
  }

  ngOnDestroy() {
    this.client.destroy();
  }
}
