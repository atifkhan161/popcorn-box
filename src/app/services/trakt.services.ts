import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import { _ } from 'underscore';
import 'rxjs/Rx'

import { Movie } from '../model/movie.trakt';
import { Show } from '../model/show.trakt';
import { AppStorageService } from '../services/app.storage';
import { Socket } from 'ng-socket-io';

@Injectable()
export class traktService {
    loading: boolean;
    header: Headers;
    localServer: string;
    constructor(public http: Http, private appStorage: AppStorageService, private socket: Socket) {
        this.localServer = "http://localhost:8787";

        this.header = new Headers({
            "Content-Type'": 'application/json'
        });
    }

    getAllMovies() {
        this.loading = true;
        return this.http.request('assets/movies-list.json')
            .map((res: Response) => res.json());
    }
    getMovies(type: string) {
        this.loading = true;
        return this.http.get('/api/movies/' + type)
            // return this.http.request('assets/trakt-movies.json')
            .map((res: Response) => {
                return res.json();
            });
    }
    getWatchlistMovies() {
        this.loading = true;
        return this.http.get('/api/sync/watchlist')
            .map((res: Response) => {
                return res.json();
            });
    }
    getNextToWatchShows() {
        this.loading = true;
        return this.http.get('/api/sync/nexttowatch')
            .map((res: Response) => {
                return res.json();
            });
    }
    getRecommendationsMovies() {
        this.loading = true;
        return this.http.get('/api/sync/recommendations')
            .map((res: Response) => {
                return res.json();
            });
    }
    searchMovies(query: string, type: string = "popular") {
        this.loading = true;
        return this.http.get('/api/movies/search/' + query)
            // return this.http.request('assets/trakt-movies.json')
            .map((res: Response) => {
                return res.json();
            });
    }
    getShows(type: string) {
        this.loading = true;
        return this.http.get('/api/shows/' + type)
            // return this.http.request('assets/trakt.shows.json')
            .map((res: Response) => {
                return res.json();
            });
    }
    getShowDetails(imdb: string) {
        this.loading = true;
        return this.http.get('/api/shows/' + imdb + '/seasons')
            // return this.http.request('assets/trakt.seasons.json')
            .map((res: Response) => {
                return res.json();
            });
    }

    searchShows(query: string, type: string = "popular") {
        this.loading = true;
        return this.http.get('/api/movies/search/' + query)
            // return this.http.request('assets/trakt-movies.json')
            .map((res: Response) => {
                return res.json();
            });
    }

    generateDeviceCode() {
        this.loading = true;
        return this.http.get('/api/device/code').map((res: Response) => res.json());
    }

    pollAccessToken(data) {
        this.socket.emit("traktAuthenticated", data);
        return this.socket
        .fromEvent<any>("traktAuthenticated");
    }

    getSelectedShow() {
        return this.appStorage.selectedShow;
    }
    setSelectedShow(show: Show) {
        this.appStorage.selectedShow = show;
    }
    getSelectedMovie() {
        return this.appStorage.selectedMovie;
    }
    setSelectedMovie(Movie: Movie) {
        this.appStorage.selectedMovie = Movie;
    }
}