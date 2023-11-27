import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL } from './global';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

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

  constructor(private http: HttpClient) {}

  getDatosCliente(id_usuario:number): Observable<any> {
    return this.http.get<any>(`${apiURL}/usuario/listarusuarioporid/${id_usuario}`, {headers: this.agregarAuthorizationHeader()});
  }

  registrarCliente(usuario:any): Observable<any> {
    return this.http.post<any>(`${apiURL}/usuario/crear`, usuario, {headers: this.httpHeaders});
  }

  actualizarDatosCliente(id_usuario:number, usuario:any): Observable<any> {
    return this.http.put<any>(`${apiURL}/usuario/actualizar/${id_usuario}`, usuario ,{headers: this.agregarAuthorizationHeader()});
  }

  actualizarContraseniaCliente(id_usuario:number, usuario:any): Observable<any> {
    return this.http.put<any>(`${apiURL}/usuario/actualizar/contra/${id_usuario}`, usuario ,{headers: this.agregarAuthorizationHeader()});
  }

  borrarCuenta(): Observable<any> {
    return this.http.get<any>(`${apiURL}/usuario/listarclienteporid`, {headers: this.httpHeaders});
  }

  asignarRolCliente(id_usuario:number, id_rol:number): Observable<any> {
    return this.http.post<any>(`${apiURL}/rol/asignar/${id_usuario}`, {id_rol}, {headers: this.httpHeaders});
  }
}
