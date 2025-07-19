import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Spinner {

  //contenedor para un valor que puede cambiar con el tiempo. En este caso, el valor inicial es false, lo que significa que, por defecto, el spinner no se está mostrando.
  // La señal se almacena en una propiedad privada llamada _loading
  private _loading = signal(false);

  //Aquí se expone el estado del spinner al resto de la aplicación de una manera segura.
  //Esta propiedad pública y de solo lectura es la que otros componentes usarán para saber si deben mostrar el spinner. Pueden "leer" su valor (true o false), pero no pueden cambiarlo directamente. Esto obliga a que cualquier cambio de estado pase por los métodos show() y hide(), manteniendo el control centralizado.
  readonly loading = this._loading.asReadonly();

  //set() de la señal 

  public show() {
    this._loading.set(true);
  }

  public hide() {
    this._loading.set(false);
  }
}
