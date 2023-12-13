import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { apiURLSocket } from './global';


@Injectable({
  providedIn: 'root'
})
export class OrdenesSocketService {

  private socketClient = io(`${apiURLSocket}/orders/status/client`);

  conectar() {
    this.socketClient.connect();
  }

  desconectar() {
    this.socketClient.disconnect();
  }

  recibirNotificacionEstadoOrden(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socketClient.on('actualizar-orden', (message:string) => {
        observer.next(message);
      });
    });

    /*
    return new Observable<any>((observer) => {
      this.socketClient.on('actualizar-orden', (idOrden: number, nuevoEstado: string) => {
        observer.next({ idOrden, nuevoEstado });
      });
    });
    */
  }

  recibirNotificacionActualizacionTiempoEntrega(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socketClient.on('actualizar-tiempo-entrega', (message:string) => {
        observer.next(message);
      });
    });
  }

  notificarNuevaOrdenPendiente(message: any) {
    this.socketClient.emit('nueva-orden-pendiente', message);
  }

  notificarOrdenCancelada(message: any) {
    this.socketClient.emit('nueva-orden-cancelada', message);
  }
}
