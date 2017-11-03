import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx'

import * as ipc from 'electron-ipc-server';
// import * as Trakt from 'trakt.tv';

@Injectable()
export class traktService {
    loading: boolean;
    clientId: string;
    clientSecret: string;
    authToken: string;
    apiUrl: string;
    header: Headers;
    localServer: string;
    client: any;
    // trakt: Trakt;
    constructor(private http: Http) {
        this.clientId = "42ee8abf7aa0c5c2d275a81877a323dafe105b821dec2785f848bd3d9bf7ccb7";
        this.clientSecret = "37c4043b6481b17fd95f8f7cacec18ad21c907296458cbeabfefc824de8b148d";
        this.apiUrl = "https://api.trakt.tv";
        this.localServer = "http://localhost:8787";

        this.header = new Headers({
            "Content-Type'": 'application/json',
            "trakt-api-version": "2",
            "trakt-api-key": this.clientId
            // 'Accept': 'application/json',
            // 'Access-Control-Allow-Origin': '*',
            // 'Access-Control-Allow-Credentials': 'true',
            // "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
            // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        });

        //trakt credentials
        let options = {
            client_id: this.clientId,
            client_secret: this.clientSecret,
            pagination: true      // defaults to false, global pagination (see below)
        };
        // this.trakt = new Trakt(options);
        this.client = ipc.createClient();
    }

    getAllMovies() {
        this.loading = true;
        return this.http.request('assets/movies-list.json')
            .map((res: Response) => res.json());
    }
    getTrendingMovies(): Promise<any> {
        this.loading = true;
        return this.http.get(this.localServer + '/movies/trending',{headers : this.header})
            .map((res: Response) => res.json()).toPromise();
        // return fetch(this.apiUrl + '/movies/trending', {
        //     mode: 'no-cors', headers: {
        //         "Content-Type'": 'application/json',
        //         "trakt-api-version": "2",
        //         "trakt-api-key": this.clientId
        //     }
        // });
    }

    generateDeviceCode(): Promise<any> {
        this.loading = true;
        return this.http.post(this.apiUrl + '/oauth/device/code', {
            "client_id": this.clientId
        }).map((res: Response) => res.json()).toPromise();
        // this.client.get('/oauth/device/code')
        // .resolve(response =>
        // {
        //     console.log(`users`, response.body)
        //     // now go and do something with your list of users! 
        // });
    }
}