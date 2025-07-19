import { HttpInterceptorFn } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 400:
          alert(error.error?.message || 'Solicitud incorrecta (400)');
          break;
        case 401:
          alert('No autorizado. Redirigiendo al login...');
          router.navigate(['/login']);
          break;
        case 403:
          alert('Acceso denegado (403)');
          break;
        case 404:
          alert('Recurso no encontrado (404)');
          break;
        case 500:
          alert('Error interno del servidor (500)');
          break;
        default:
          alert(`Error inesperado (${error.status})`);
      }

      return throwError(() => error);
    })
  );
};