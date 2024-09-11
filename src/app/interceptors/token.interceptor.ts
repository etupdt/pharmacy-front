import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    const localUserTokens: string = localStorage.getItem('pharmacy_token')!

    let modifiedReq

    if (localUserTokens) {
        const userTokens: any = JSON.parse(localUserTokens)
        // if (Date.now() > helper.decodeToken(userTokens.access_token).exp * 1000) {
        //     headerService.user = new User()
        //     headerService.signalUser.set(headerService.user)
        //     localStorage.removeItem('arcadia_tokens')
        //     modifiedReq = request
        // } else {
            modifiedReq = request.clone({
                headers: request.headers.set('Authorization', `Bearer ${userTokens.access_token}`),
            })
        // }
    } else {
        modifiedReq = request
    }
   
    return next.handle(request);

  }
}
