import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL } from './global';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http: HttpClient, private authService: AuthService) {}

  
  private httpHeaders = new HttpHeaders(
    {'Content-Type': 'application/json'}
  );

  getCategorias(): Observable<any> {
    return this.http.get<any>(`${apiURL}/categoria/listar`,{headers: this.httpHeaders});
  }
}
