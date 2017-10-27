import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx'

@Injectable()
export class MovieApiService {
    loading:boolean;
    clientId: string;
    clientSecret: string;
    authToken: string;
    apiUrl: string;

    constructor(private http: Http){
        this.clientId = "42ee8abf7aa0c5c2d275a81877a323dafe105b821dec2785f848bd3d9bf7ccb7";
        this.clientSecret = "37c4043b6481b17fd95f8f7cacec18ad21c907296458cbeabfefc824de8b148d";
        this.apiUrl = "https://api-staging.trakt.tv";
    }

    getAllMovies(){
        this.loading = true;
        return  this.http.request('assets/movies-list.json')
                    .map((res:Response)=> res.json());
    }
    generateDeviceCode(){
        this.loading = true;
        return  this.http.post('/oauth/device/code', {
            "client_id": this.clientId

        }).map((res:Response)=> res.json());
    }
}