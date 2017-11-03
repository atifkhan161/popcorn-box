import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';

import 'rxjs/Rx'

import {Movie} from '../model/movie';

@Injectable()
export class ShowsApiService {
    loading:boolean;
    constructor(private http: Http){}

    getAllShows(){
        this.loading = true;
        return  this.http.request('assets/shows.list.json')
                    .map((res:Response)=> res.json());
    }
}