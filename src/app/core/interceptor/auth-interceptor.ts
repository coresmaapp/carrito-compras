import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if(sessionStorage.getItem('accessToken')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`
      }
    });
  }
  return next(req);
};
