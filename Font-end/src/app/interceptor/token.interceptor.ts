import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, pipe, switchMap, throwError } from 'rxjs';
import { TokenModel } from '../Model/tokenmodel';
import { ServiceService } from '../service/Service.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: ServiceService, private rout: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (
      req.url === 'https://localhost:7079/api/User/sendLink' ||
      req.url === 'https://localhost:7079/api/User/resetPassword'
    ) {
      return next.handle(req);
    }
    let authToken = this.auth.GetToken();
    req = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + `${authToken}`,
        'Cache-Control': 'no-cache, no-store, must-revalidate, private',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
    return next.handle(req).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            let tokenApimodel = new TokenModel();
            tokenApimodel.accessToken = this.auth.GetToken()!;
            tokenApimodel.refreshToken = this.auth.GetRefreshToken()!;
            return this.auth.sendtoken(tokenApimodel).pipe(
              switchMap((data:TokenModel)=>{
                this.auth.StoreRefreshtoken(data.refreshToken);
                this.auth.StoreToken(data.accessToken);
                   req = req.clone({setHeaders: {
                    Authorization: `Bearer ${data.accessToken}`
                  }})
                  return next.handle(req);
              }),
              catchError((err) => {
                console.log(err);
                return throwError(()=>{
                 alert({detail:"Warning",summary:"Token exprire"});
                    this.rout.navigate(['login']);
                })
              })
            )
          }
        }
        return throwError(() => error);
      })
    );
  }
}


