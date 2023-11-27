import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL } from './global';

@Injectable({
  providedIn: 'root'
})
export class ComboService {

  private httpHeaders = new HttpHeaders(
    {'Content-Type': 'application/json'}
  );

  constructor(private http: HttpClient) {}

  listarProdsCombo(id_producto:number): Observable<any> {
    return this.http.get<any>(`${apiURL}/combo/listar/prodsporcombo/${id_producto}`, {headers: this.httpHeaders});
  }
}
