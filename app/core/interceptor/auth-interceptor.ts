import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  if(localStorage.getItem('accessToken')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });
  }
  return next(req);
};
