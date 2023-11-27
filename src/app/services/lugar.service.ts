import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL } from './global';

@Injectable({
  providedIn: 'root'
})
export class LugarService {

  constructor(private http: HttpClient) {}

  
  private httpHeaders = new HttpHeaders(
    {'Content-Type': 'application/json'}
  );


  getLugares(): Observable<any> {
    return this.http.get<any>(`${apiURL}/lugar/listarweb`, {headers: this.httpHeaders});
  }
}
