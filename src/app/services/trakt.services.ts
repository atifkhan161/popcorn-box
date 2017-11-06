import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import { _ } from 'underscore';
import 'rxjs/Rx'

import { Movie } from '../model/movie.trakt';

@Injectable()
export class traktService {
    loading: boolean;
    header: Headers;
    localServer: string;
    constructor(private http: Http) {
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
    getTrendingMovies() {
        this.loading = true;
        // return this.http.get('/api/movies/trending')
        return this.http.request('assets/trakt-movies.json')
            .map((res: Response) => {
               return _.pluck(res.json(), 'movie');
            });
    }

    generateDeviceCode() {
        this.loading = true;
        return this.http.get('/api/device/code').map((res: Response) => res.json());
    }
}