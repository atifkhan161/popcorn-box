import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import { _ } from 'underscore';
import 'rxjs/Rx';
import { Movie } from '../model/movie.trakt';

@Injectable()
export class sourcesService {
    loading: boolean;
    header: Headers;
    localServer: string;
    constructor(private http: Http) {
        this.localServer = "http://localhost:8787";

        this.header = new Headers({
            "Content-Type'": 'application/json'
        });
    }

    getYifyMovieSources(imdbId : string) {
        this.loading = true;
        return this.http.request('assets/yify-movie.json')
            .map((res: Response) => res.json());
    }

    getMovieStreams(movie : Movie) {
        return this.http.post("/scrape/movie",{
            "title": movie.title,
            "year": movie.year,
            "ids": movie.ids
        }).map((res: Response) => res.json());
    }
}