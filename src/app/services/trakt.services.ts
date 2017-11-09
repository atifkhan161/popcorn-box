import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import { _ } from 'underscore';
import 'rxjs/Rx'

import { Movie } from '../model/movie.trakt';
import { Show } from '../model/show.trakt';
import { AppStorageService } from '../services/app.storage';

@Injectable()
export class traktService {
    loading: boolean;
    header: Headers;
    localServer: string;
    constructor(private http: Http, private appStorage: AppStorageService) {
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
                // if (type != "popular") {
                //     return _.pluck(res.json(), 'movie');
                // }
                // else {
                return res.json();
                // }
            });
    }

    searchMovies(query: string, type: string = "popular") {
        this.loading = true;
        return this.http.get('/api/movies/search/' + query)
            // return this.http.request('assets/trakt-movies.json')
            .map((res: Response) => {
                // if (type != "popular") {
                //     return _.pluck(res.json(), 'movie');
                // }
                // else {
                return res.json();
                // }
            });
    }
    getShows(type: string) {
        this.loading = true;
        // return this.http.get('/api/movies/' + type)
        return this.http.request('assets/trakt.shows.json')
            .map((res: Response) => {
                // if (type != "popular") {
                //     return _.pluck(res.json(), 'movie');
                // }
                // else {
                return res.json();
                // }
            });
    }

    searchShows(query: string, type: string = "popular") {
        this.loading = true;
        // return this.http.get('/api/movies/search/' + query)
        return this.http.request('assets/trakt-movies.json')
            .map((res: Response) => {
                // if (type != "popular") {
                //     return _.pluck(res.json(), 'movie');
                // }
                // else {
                return res.json();
                // }
            });
    }

    generateDeviceCode() {
        this.loading = true;
        return this.http.get('/api/device/code').map((res: Response) => res.json());
    }

    getSelectedShow() {
        return this.appStorage.selectedShow;
    }
    setSelectedShow(show: Show) {
        this.appStorage.selectedShow = show;
    }
}