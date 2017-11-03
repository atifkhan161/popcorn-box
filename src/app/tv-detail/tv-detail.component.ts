import { Component, OnInit, OnChanges, OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import * as webtorrent from 'webtorrent';

import { Movie } from '../model/movie';
import { Source } from '../model/sources';
@Component({
  selector: 'tv-detail',
  templateUrl: './tv-detail.component.html',
  styleUrls: ['./tv-detail.component.css']
})
export class TvDetailComponent implements OnInit {

  @Input() movie: Movie;
  @Output() closeView = new EventEmitter<boolean>();

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
    // this.loadSources();
  }
  cView() {
    this.closeView.emit();
    this.client.destroy();
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
