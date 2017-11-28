import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx'

import { Movie } from '../model/movie';
import { HttpInterceptor } from 'app/services/app.interceptor';

// import * as Trakt from 'trakt.tv';

@Injectable()
export class ytsService {
    loading: boolean;
    apiUrl: string;
    TRACKERS: string;
    magnetURI: any;
    movies: Movie[];
    constructor(public http: HttpInterceptor) {

        this.apiUrl = "https://yts.ag/api/v2/list_movies.json";
        this.TRACKERS = [
            'udp://open.demonii.com:1337',
            'udp://tracker.istole.it:80',
            'http://tracker.yify-torrents.com/announce',
            'udp://tracker.publicbt.com:80',
            'udp://tracker.openbittorrent.com:80',
            'udp://tracker.coppersurfer.tk:6969',
            'udp://exodus.desync.com:6969',
            'http://exodus.desync.com:6969/announce'
        ].join('&tr=')

        const magnetURI = (hash, title) => {
            return `magnet:?xt=urn:btih:${hash}&dn=${encodeURIComponent(title)}&tr=${this.TRACKERS}`
        }
        this.movies = [];
    }

    getAllMovies(): Promise<any> {
        this.loading = true;
        let self = this;
        return this.http.get(this.apiUrl + "?sort_by=seeds&limit=50")
        // return this.http.get('assets/yts_list_movies.json')
            .toPromise()
            .then(response => {
                let resp: string[] = response.json().data.movies;
                resp.forEach(mov => {
                    let obj = new Movie(mov["imdb_code"], mov['title'], mov['year'],
                        {
                            'poster': mov['medium_cover_image'],
                            'fanart': mov['background_image'],
                            "background_image": mov["background_image"],
                            "background_image_original": mov["background_image_original"],
                            "large_cover_image": mov["large_cover_image"]
                        },
                        mov['synopsis'], mov['runtime'], mov['year'],
                        mov['yt_trailer_code'],"",mov["torrents"], mov['genres']);
                        self.movies.push(obj);
                });
                return self.movies;
            })
            .catch(err => err);
    }
    searchMovies(query : string): Promise<any> {
        this.loading = true;
        let self = this;
        // return this.http.get(this.apiUrl + "?sort=seeds&limit=50&query_term=" + query)
        return this.http.get('assets/yts_list_movies.json')
            .toPromise()
            .then(response => {
                let resp: string[] = response.json().data.movies;
                resp.forEach(mov => {
                    let obj = new Movie(mov["imdb_code"], mov['title'], mov['year'],
                        {
                            'poster': mov['medium_cover_image'],
                            'fanart': mov['background_image'],
                            "background_image": mov["background_image"],
                            "background_image_original": mov["background_image_original"],
                            "large_cover_image": mov["large_cover_image"]
                        },
                        mov['synopsis'], mov['runtime'], mov['year'],
                        mov['yt_trailer_code'],"",mov["torrents"], mov['genres']);
                        self.movies.push(obj);
                });
                return self.movies;
            })
            .catch(err => err);
    }
}