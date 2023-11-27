import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carritoObs: BehaviorSubject<any[]>;
  private _carrito: any[] = [];

  constructor() { 
    this.carritoObs = new BehaviorSubject<any[]>([]);
  }

  get carrito() {
    return this.carritoObs.asObservable();
  }

  agregarProductoAlCarrito(producto:any) {
    
    //const productoIndependiente = { ...producto }; // Crear una copia independiente
    const productoIndependiente = JSON.parse(JSON.stringify(producto)); // Crea una copia independiente más profunda debido a los arrays anidados de acompañamientos y combos que contiene
    this._carrito.push(productoIndependiente);
    this.carritoObs.next(this._carrito);
    
    /*
    if (sessionStorage.getItem('carrito')) {
      let carrito:any[] = JSON.parse(sessionStorage.getItem('carrito') ?? '');
      carrito.push(producto);
      sessionStorage.setItem('carrito',JSON.stringify(carrito));
      this.carritoObs.next(carrito);
    } else {
      let carrito = [];
      carrito.push(producto);
      sessionStorage.setItem('carrito',JSON.stringify(carrito));
      this.carritoObs.next(carrito);
    }
    */
  }

  eliminarProductoCarrito(index:number) {

    /*
    let carrito:any[] = JSON.parse(sessionStorage.getItem('carrito') ?? '');
    carrito.splice(index, 1);
    sessionStorage.setItem('carrito', JSON.stringify(carrito));
    this.carritoObs.next(carrito);
    */
    
    this._carrito.splice(index, 1);
    this.carritoObs.next(this._carrito);
    
  }
}
