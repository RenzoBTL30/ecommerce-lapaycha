import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL } from './global';


@Injectable({
  providedIn: 'root'
})
export class DireccionesService {

  constructor(private http: HttpClient) {}
  
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

  getDireccionesPorUsuario(id_usuario:number): Observable<any> {
    return this.http.get<any>(`${apiURL}/direccion/buscarPorUsuario/${id_usuario}`,{headers: this.agregarAuthorizationHeader()});
  }

  getDireccionById(id_direccion:number): Observable<any> {
    return this.http.get<any>(`${apiURL}/direccion/buscarporid/${id_direccion}`,{headers: this.agregarAuthorizationHeader()});
  }

  registrarDireccion(direccion:any, id_usuario:number): Observable<any> {
    return this.http.post<any>(`${apiURL}/direccion/crear`,
    { direccion: direccion.direccion,
      id_lugar: direccion.id_lugar,
      id_usuario: id_usuario
    },
    {headers: this.agregarAuthorizationHeader()});
  }

  editarDireccion(direccion:string, id_direccion:number, id_lugar:number): Observable<any> {
    return this.http.put<any>(`${apiURL}/actualizar/${id_direccion}`,{direccion: direccion, id_lugar: id_lugar}, {headers: this.agregarAuthorizationHeader()});
  }
}
