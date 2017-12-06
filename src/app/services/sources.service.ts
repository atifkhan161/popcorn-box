import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import { _ } from 'underscore';
import 'rxjs/Rx';
import { Socket } from 'ng-socket-io';

import { Movie } from '../model/movie.trakt';
import { Show } from '../model/show.trakt';

@Injectable()
export class sourcesService {
    loading: boolean;
    header: Headers;
    localServer: string;
    constructor(private http: Http, private socket: Socket) {
        this.localServer = "http://localhost:8787";

        this.header = new Headers({
            "Content-Type'": 'application/json'
        });
    }

    getYifyMovieSources(imdbId : string) {
        this.loading = true;
        return this.http.get('assets/yify-movie.json')
            .map((res: Response) => res.json());
    }

    getMovieStreams(movie : Movie) {
        // return this.http.post("/scrape/movie",{
        //     "title": movie.title,
        //     "year": movie.year,
        //     "ids": movie.ids
        // }).map((res: Response) => res.json());
        this.socket.emit("scrapeMovie", {
            "title": movie.title,
            "year": movie.year,
            "ids": movie.ids
        });
        return this.socket
        .fromEvent<any>("scrapeMovie")
        .map( obj => obj['data'] );
    }
    getEpisodeStreams(Show : Show, episode: any) {
        return this.http.post("/scrape/episode",{
            "title": Show.title,
            "year": Show.year,
            "ids": Show.ids,
            episode: episode
        }).map((res: Response) => res.json());
    }
}