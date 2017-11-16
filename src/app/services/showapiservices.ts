import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';

import 'rxjs/Rx'
import { query } from '@angular/core/src/animation/dsl';


@Injectable()
export class ShowsApiService {
    loading: boolean;

    constructor(private http: Http) { }

    seachEztv(imdbId: string) {
        this.loading = true;
        // return this.http.request('/eztv/search/' + imdbId)
        return this.http.request('assets/eztv.show.json')
            .map((res: Response) => res.json());
    }
    seachPopcorn(imdbId: string) {
        this.loading = true;
        // return this.http.request('/eztv/search/' + imdbId)
        return this.http.request('assets/popcorn.show.json')
            .map((res: Response) => res.json());
    }
    seachIdope(Query: string) {
        this.loading = true;
        return this.http.post('/api/idope', {
            "query": Query
        }).map((res: Response) => res.json());
    }

    formEpisodeQuery(title: string, season: number, episode: number) {
        let q = title;
        if (season > 9) {
            q += ' s' + season;
        }
        else {
            q += ' s0' + season;
        }
        if (episode > 9) {
            q += ' e' + episode;
        }
        else {
            q += ' e0' + episode;
        }
        return q.replace(/\s/g, ".");
    }
    formMagnetUrl(hash, title) {
        const magnetURI = (hash, title) => {
            return `magnet:?xt=urn:btih:${hash}`
        }

        return magnetURI(hash, title);
    }
}