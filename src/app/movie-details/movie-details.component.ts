import { Component, OnInit, OnChanges,OnDestroy, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import {Movie} from '../model/movie';
import * as webtorrent from 'webtorrent';

@Component({
  selector: 'movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit, OnChanges {
@Input() movie: Movie;
@Output() closeView = new EventEmitter<boolean>();
client: webtorrent;
isThumbnail:boolean;
@ViewChild('Popcornplayer') player: ElementRef;
  constructor() { }

  ngOnInit() {
    this.isThumbnail = true;
    this.movie.rating.stars = this.movie.rating.percentage / 20;
    this.client = new webtorrent();
  }
  ngOnChanges(changes) {
      this.movie.rating.stars = this.movie.rating.percentage / 20;
  }

  cView () {
    this.closeView.emit();
  }

  watch() {
    var quality = this.movie.torrents["en"];
    var uri = quality["1080p"]["url"];
    this.isThumbnail = false;    
    this.client.add(uri, this.fetchSuccess);
  }
  fetchSuccess(torrent) {
    // Torrents can contain many files. Let's use the .mp4 file
    var file = torrent.files.find(function (file) {
      return file.name.endsWith('.mp4')
    });
    if (file){
      // var player = document.getElementsByClassName('popcorn-box-player');
      // player.append(file);
      // file.appendTo('#popcorn-box-player', function (err, elem) {
      //   if (err) throw err // file failed to download or display in the DOM
      //   console.log('New DOM node with the content', elem)
      // });
      file.renderTo('video#popcorn-box-player');
    }
  }
  
  ngOnDestroy(){
    this.client.destroy();
  }
}
