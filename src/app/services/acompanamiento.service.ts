import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL } from './global';

@Injectable({
  providedIn: 'root'
})
export class AcompanamientoService {

  /*
  private httpHeaders = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };
  */
  private httpHeaders = new HttpHeaders(
    {'Content-Type': 'application/json'}
  );

  constructor(private http: HttpClient) {}

  listarProdsAcomp(id_producto:number): Observable<any> {
    return this.http.get<any>(`${apiURL}/acompanamiento/listar/prodsporacomp/${id_producto}`, {headers: this.httpHeaders});
  }
}
