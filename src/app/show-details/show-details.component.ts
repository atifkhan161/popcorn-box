import { Component, OnInit, ElementRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'

import { traktService } from '../services/trakt.services';
import { ShowsApiService } from '../services/showapiservices';

import { Show } from '../model/show.trakt';
import { Episode, Season } from '../model/base';
import { idope } from '../model/idope';
import * as webtorrent from 'webtorrent';
import { sourcesService } from '../services/sources.service';

@Component({
  selector: 'show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.css']
})
export class ShowDetailsComponent implements OnInit {
  show: Show;
  showBackground: any;
  selectedSeason: Season;
  selectedEpisode: Episode;
  idopeResult: idope[];
  client: webtorrent;
  sourceFile: any;
  videoUrl: string;
  eztvTorrents: any;
  eztvTorrent: any;
  popcornTorrents: any;
  popcornTorrent: any;
  file:any;
  streamResult: any;  
  player: any;  
  constructor(private elRef: ElementRef, private trakt: traktService, private showService: ShowsApiService, private sourcesService: sourcesService) { }

  ngOnInit() {
    if (this.client) {
      this.client.destroy();
    }
    this.client = new webtorrent();
    this.show = this.trakt.getSelectedShow();

    this.showBackground = this.show.showbackground[0].url;
    this.trakt.getShowDetails(this.show.ids.imdb).subscribe(seas => {
      this.show.seasons = seas;
      this.selectedSeason = seas[0];
    });
    this.showService.seachEztv(this.show.ids.imdb).subscribe(torrents => {
      this.eztvTorrents = torrents;
    });
    this.popcornTorrent = {};
    this.showService.seachPopcorn(this.show.ids.imdb).subscribe(torrents => {
      this.popcornTorrents = torrents;
    });
    this.player = this.elRef.nativeElement.querySelector('.popcorn-box-player');    
  }

  selectSeason(season) {
    this.selectedSeason = season;
  }
  selectEpisode(episode: Episode) {
    this.selectedEpisode = episode;
    let query = this.showService.formEpisodeQuery(this.show.title, this.selectedSeason.number, this.selectedEpisode.number);
    this.showService.seachIdope(query).subscribe(res => {
      if (res.result.items.length > 0) {
        this.idopeResult = res.result.items;
      }
    });
    //Eztv filter
    this.eztvTorrent = this.eztvTorrents.filter(tor => {
      return tor.season == this.selectedSeason.number && tor.episode == this.selectedEpisode.number;
    });
    //Popcorn filter
    this.popcornTorrent = this.popcornTorrents.episodes.filter(tor => {
      return tor.season == this.selectedSeason.number && tor.episode == this.selectedEpisode.number;
    });
    //Source streams
    this.refreshStream();
  }

  watch(source) {
    this.sourceFile = source;
    let url = "";
    if (source.magnet_url) {
      url = source.magnet_url;
    }
    else if (source.url) {
      url= source.url;
    }
    else {
      // url = this.showService.formMagnetUrl(source.info_hash, source.name);
      url = source.info_hash;
    }
    this.client.add(url, torrent => {
      // Torrents can contain many files. Let's use the .mp4 file
      this.file = torrent.files.find(function (file) {
        let isVideo = false;
        if (file.name.endsWith('.avi') || file.name.endsWith('.mkv') || file.name.endsWith('.mp4')) {
          isVideo = true;
        }
        return isVideo;
      });
      if (this.file) {
        this.file.renderTo('video#popcorn_show_player');
      }
    });
  }
  fetchSuccess(torrent) {
    let self = this;
    // Torrents can contain many files. Let's use the .mp4 file
    var file = torrent.files.find(function (file) {
      let isVideo = false;
      if (file.name.endsWith('.avi') || file.name.endsWith('.mkv') || file.name.endsWith('.mp4')) {
        isVideo = true;
      }
      return isVideo;
    });
    if (file) {
      file.appendTo('popcorn_show_player');
    }
  }

  getSeasonPoster(season : Season) {
    let thumbUrl = "";
    let seasonImages = this.show.seasonthumb.filter(thumb =>{
      return thumb.season == season.number.toString();
    });
    if (seasonImages.length >0) {
      thumbUrl = seasonImages[0].url
      // .replace('/fanart/', '/preview/');
    }
    return thumbUrl;
  }

  refreshStream() {
    //Streams
    this.streamResult = [];
    this.sourcesService.getEpisodeStreams(this.show, this.selectedEpisode).subscribe(res => {
      this.streamResult = res;
    });
  }
  watchStream(watchStream) {
    let s = document.createElement("source");
    s.type = watchStream.type;
    s.src = watchStream.file;
    this.player.appendChild(s);
    this.player.play();
  }

}
