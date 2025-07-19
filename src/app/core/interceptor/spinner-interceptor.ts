import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { Spinner } from '../services/spinner';

export const spinnerInterceptor: HttpInterceptorFn = (req, next) => {
  // 1. Inyecta el servicio y guárdalo en una constante
  const spinner = inject(Spinner);

  // 2. Muestra el spinner antes de que la petición se envíe
  spinner.show();

  // 3. Usa el operador `finalize` para ocultar el spinner cuando la petición termine (ya sea con éxito o con error)
  return next(req).pipe(finalize(() => spinner.hide()));
};
