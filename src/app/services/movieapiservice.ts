import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';

import 'rxjs/Rx'

import {Movie} from '../model/movie';

@Injectable()
export class MovieApiService {
    loading:boolean;
    constructor(public http: Http){}

    getAllMovies(){
        this.loading = true;
        return  this.http.get('assets/movies-list.json')
                    .map((res:Response)=> res.json());
    }
}