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

// Shows Progress bar and notifications
import { SlimLoadingBarService } from 'ng2-slim-loading-bar';

@Injectable()
export class HttpInterceptor extends Http {
    urlCount: number;
    constructor(
        backend: ConnectionBackend,
        defaultOptions: RequestOptions,
        private slimLoadingBarService: SlimLoadingBarService
    ) {
        super(backend, defaultOptions);
        this.urlCount = 0;
    }
    /**
     * Performs a request with `get` http method.
     * @param url
     * @param options
     * @returns {Observable<>}
     */
    get(url: string, options?: RequestOptionsArgs): Observable<any> {
        this.beforeRequest();
        return super.get(url, this.requestOptions(options))
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .finally(() => {
                this.onFinally();
            });
    }
    /**
     * Performs a request with `post` http method.
     * @param url
     * @param body
     * @param options
     * @returns {Observable<>}
     */
    post(url: string, body: any, options?: RequestOptionsArgs): Observable<any> {
        this.beforeRequest();
        return super.post(url, body, this.requestOptions(options))
            .catch(this.onCatch)
            .do((res: Response) => {
                this.onSuccess(res);
            }, (error: any) => {
                this.onError(error);
            })
            .finally(() => {
                this.onFinally();
            });
    }

    /**
     * Request options.
     * @param options
     * @returns {RequestOptionsArgs}
     */
    private requestOptions(options?: RequestOptionsArgs): RequestOptionsArgs {
        if (options == null) {
            options = new RequestOptions();
        }
        if (options.headers == null) {
            options.headers = new Headers({
            });
        }
        return options;
    }
    /**
   * Error handler.
   * @param error
   * @param caught
   * @returns {ErrorObservable}
   */
    private onCatch(error: any, caught: Observable<any>): Observable<any> {
        // this.notifyService.popError();
        return Observable.throw(error);
    }

    /**
     * onSuccess
     * @param res
     */
    private onSuccess(res: Response): void {
    }
    /**
   * onError
   * @param error
   */
    private onError(error: any): void {
        // this.notifyService.popError();
    }

    private beforeRequest(): void {
        this.urlCount++;
        this.slimLoadingBarService.start();
    }

    private afterRequest(): void {
        this.urlCount--;
        if (this.urlCount == 0) {
            this.slimLoadingBarService.complete();
        }
    }
    /**
   * onFinally
   */
    private onFinally(): void {
        this.afterRequest();
    }
}