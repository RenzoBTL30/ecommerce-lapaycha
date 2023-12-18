import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, take, throwError } from 'rxjs';
import { apiURL } from './global';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {
  
  //ordenRegistradaSubject: Subject<any> = new Subject<any>();

  //ordenRegistrada$ = this.ordenRegistradaSubject.asObservable();

  constructor(private http: HttpClient) { }
  
  private httpHeaders = new HttpHeaders(
    {'Content-Type': 'application/json'}
  );
  
  private agregarAuthorizationHeader(){
    let token = sessionStorage.getItem('token') ?? '';
    if(token!=null){
      return this.httpHeaders.append('Authorization',token);
    }
    return this.httpHeaders;
  }

  registrarOrden(orden:any): Observable<any> {
    return this.http.post<any>(`${apiURL}/orden/crear`, orden, {headers: this.agregarAuthorizationHeader()});
  }

  getOrdenesAll(id_usuario:number): Observable<any> {
    return this.http.get<any>(`${apiURL}/orden/buscar/porcliente/${id_usuario}`, {headers: this.agregarAuthorizationHeader()});
  }

  getOrdenesByIdUsuarioAndStatus(id_usuario:number, estado:string): Observable<any> {
    return this.http.get<any>(`${apiURL}/orden/buscar/porclienteestado/${id_usuario}/${estado}`, {headers: this.agregarAuthorizationHeader()});
  }

  getOrdenById(id_orden:number): Observable<any> {
    return this.http.get<any>(`${apiURL}/orden/buscar/porid/${id_orden}`, {headers: this.agregarAuthorizationHeader()});
  }

  //Cancelar pedido u orden
  cancelarOrden(id_orden:number): Observable<any> {
    return this.http.put<any>(`${apiURL}/orden/cancelarorden/${id_orden}`,{},{headers: this.agregarAuthorizationHeader()});
  }

  // ----- Puntos ----- //

  aplicarPuntosParaDescuento(id_usuario:number, puntos:number): Observable<any> {
    return this.http.post<any>(`${apiURL}/puntos/aplicar/${id_usuario}`, { puntos:puntos }, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError((error: any) => {
        return throwError(() => error);
      })
    );;
  }

  canjearPuntos(id_usuario:number, puntos:number): Observable<any> {
    return this.http.post<any>(`${apiURL}/puntos/canjear/${id_usuario}`, { puntos:puntos }, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError((error: any) => {
        return throwError(() => error);
      })
    );;
  }

  calcularPuntosGanados(total:any): Observable<any> {
    return this.http.post<any>(`${apiURL}/puntos/calcular`, { total:total }, {headers: this.agregarAuthorizationHeader()}).pipe(
      catchError((error: any) => {
        return throwError(() => error);
      })
    );;
  }


}
