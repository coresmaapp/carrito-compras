import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { authInterceptor } from './core/interceptor/auth-interceptor';
import { spinnerInterceptor } from './core/interceptor/spinner-interceptor';
import { httpErrorInterceptor } from './core/interceptor/http-error-interceptor';



import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, spinnerInterceptor, httpErrorInterceptor]))
  ]
};
