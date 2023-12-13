import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io } from 'socket.io-client';
import { apiURLSocket } from './global';

@Injectable({
  providedIn: 'root'
})
export class ProductosSocketService {

  private socketClient = io(`${apiURLSocket}/products/client`);

  conectar() {
    this.socketClient.connect();
  }

  desconectar() {
    this.socketClient.disconnect();
  }

  recibirNotificacionDisponibilidad(): Observable<any> {
    return new Observable<any>((observer) => {
      this.socketClient.on('actualizar-disponibilidad', (message:string) => {
        observer.next(message);
      });
    });
  }

}
