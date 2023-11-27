import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService, JwtModule } from "@auth0/angular-jwt";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { apiURL } from './global';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private _token:string |null = '';

  constructor(private http: HttpClient, private router: Router) {}

  opciones: any = [];

  login(credentials: { email: string; contrasenia: string }): Observable<any> {
    return this.http.post<any>(`${apiURL}/auth/login`, credentials).pipe(
      catchError((error: any) => {
        return throwError(() => error);
      })
    );
  }

  guardarUsuario(usuario: any): void {
    sessionStorage.setItem('id_usuario', usuario.id_usuario);
    sessionStorage.setItem('email', usuario.email);
    sessionStorage.setItem('nombre', usuario.nombre);
    sessionStorage.setItem('apellidos', usuario.apellidos);
    sessionStorage.setItem('celular', usuario.celular);
    sessionStorage.setItem('rol', usuario.rol);
  }

  guardarToken(session_token: string): void {
    sessionStorage.setItem('token', session_token);
  }

  eliminarDatos() {
    sessionStorage.clear();
  }

  isAuthenticated() : boolean{
    const token = sessionStorage.getItem('token');

    if (!token) {
      return false;
    }
    try {
      const helper = new JwtHelperService();
      let decodedToken = helper.decodeToken(token);
      
      if (!decodedToken) {
        sessionStorage.clear();
        return false;
      }
    } catch (error) {
      sessionStorage.clear();
      return false
    }
    return true;
  }
}
