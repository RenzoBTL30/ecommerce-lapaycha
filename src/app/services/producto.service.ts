import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL } from './global';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient) {}

  getProductosByCategoria(id: number): Observable<any> {
    return this.http.get<any>(`${apiURL}/producto/buscar/productos/${id}`);
  }

  getProductosById(id: number): Observable<any> {
    return this.http.get<any>(`${apiURL}/producto/buscar/producto/${id}`);
  }
}
