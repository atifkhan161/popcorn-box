import { Injectable } from '@angular/core';
import {
    Http,
    ConnectionBackend,
    RequestOptions,
    RequestOptionsArgs,
    Response,
    Headers,
    Request
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import { environment } from '../../environments/environment';
import { IHttpInterceptor } from 'angular2-http-interceptor';
// Shows Progress bar and notifications
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

@Injectable()
export class AppInterceptor implements IHttpInterceptor {
    urlCount: number;
    constructor(private slimLoadingBarService: SlimLoadingBarService) {
        this.urlCount = 0;
    }
    before(request: Request): Request {
        if (this.urlCount == 0) {
            this.slimLoadingBarService.start();
        }
        this.urlCount++;
        return request;
    }
    after(response: Observable<Response>): Observable<Response>{
        return response.do(r =>{
            this.urlCount--;
            if (this.urlCount == 0) {
                this.slimLoadingBarService.complete();
            }   
        });
    }
}