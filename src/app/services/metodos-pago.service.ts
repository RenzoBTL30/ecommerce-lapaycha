import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL } from './global';

@Injectable({
  providedIn: 'root'
})
export class MetodosPagoService {

  constructor(private http: HttpClient) {}

  
  private httpHeaders = new HttpHeaders(
    {'Content-Type': 'application/json'}
  );


  getMetodosPago(): Observable<any> {
    return this.http.get<any>(`${apiURL}/metodopago/listar`, {headers: this.httpHeaders});
  }
}
