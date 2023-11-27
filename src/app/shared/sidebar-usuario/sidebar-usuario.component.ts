import { Component } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-sidebar-usuario',
  templateUrl: './sidebar-usuario.component.html',
  styleUrls: ['./sidebar-usuario.component.css']
})
export class SidebarUsuarioComponent {

  nombreUsuario:any;
  apellidosUsuario:any;
  email:any;
  token:any;
  idUsuario:any;
  
  constructor(private clienteService: ClienteService) {

  }

  ngOnInit(): void {
    this.obtenerDatos();
  }


  obtenerDatos() {
    this.nombreUsuario = sessionStorage.getItem('nombre') ?? '';
    this.apellidosUsuario = sessionStorage.getItem('apellidos') ?? '';
    this.email = sessionStorage.getItem('email') ?? '';
    this.token = sessionStorage.getItem('token') ?? '';
  }

  /*
  obtenerPuntosDescuentoUsuario(id:any) {
    this.clienteService.getDatosCliente(id).subscribe(data => {
      this.puntos_descuento = data[0].puntos_descuento
    });
  }
  */
}
