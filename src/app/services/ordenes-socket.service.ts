import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class OrdenesSocketService {

  private socketClient = io('http://localhost:3000/orders/status/client');

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
}
