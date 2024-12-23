import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LoginService } from '../Services/login.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private loginService:LoginService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    
    const token = sessionStorage.getItem('Token');

if(token==undefined||token==null||token==''||token=='undefined')
  this.loginService.logOut();
    if (token) {
      const authReq = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next.handle(authReq).pipe(catchError(err => {
        
        if ([401, 403].includes(err.status)
          
      ) {
        
            // auto logout if 401 or 403 response returned from api
            this.loginService.internelLogout();
        }
  
        const error = err.error?.message || err.statusText;
       
        return throwError(() => error);
    }));
    }
    
    return next.handle(request);


  }
}
