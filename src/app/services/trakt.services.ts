import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/Rx'

@Injectable()
export class traktService {
    loading: boolean;
    clientId: string;
    clientSecret: string;
    authToken: string;
    apiUrl: string;
    header: Headers;
    constructor(private http: Http) {
        this.clientId = "42ee8abf7aa0c5c2d275a81877a323dafe105b821dec2785f848bd3d9bf7ccb7";
        this.clientSecret = "37c4043b6481b17fd95f8f7cacec18ad21c907296458cbeabfefc824de8b148d";
        this.apiUrl = "https://api-staging.trakt.tv";

        this.header = new Headers({
            "Content-Type'": 'application/json',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': 'true',
            "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        });
    }

    getAllMovies() {
        this.loading = true;
        return this.http.request('assets/movies-list.json')
            .map((res: Response) => res.json());
    }
    generateDeviceCode() {
        this.loading = true;
        return this.http.post('/oauth/device/code', {
            "client_id": this.clientId
        }).map((res: Response) => res.json());
    }
}