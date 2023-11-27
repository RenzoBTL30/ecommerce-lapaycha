import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL } from './global';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private httpHeaders = new HttpHeaders(
    {'Content-Type': 'application/json'}
  );

  constructor(private http: HttpClient) {}

  getProductosByCategoria(id: number): Observable<any> {
    return this.http.get<any>(`${apiURL}/producto/buscar/productos/${id}`, {headers: this.httpHeaders});
  }

  getProductosById(id: number): Observable<any> {
    return this.http.get<any>(`${apiURL}/producto/buscar/producto/${id}`, {headers: this.httpHeaders});
  }
}
