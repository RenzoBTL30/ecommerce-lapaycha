import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-puntos-descuento',
  templateUrl: './puntos-descuento.component.html',
  styleUrls: ['./puntos-descuento.component.css']
})
export class PuntosDescuentoComponent implements OnInit{

  puntos_descuento:any;

  constructor(private clienteService: ClienteService) {

  }

  ngOnInit() {
    this.obtenerPuntosDescuentoUsuario();
  }

  obtenerPuntosDescuentoUsuario() {
    let idUsuario = parseInt(sessionStorage.getItem('id_usuario') ?? '');

    this.clienteService.getDatosCliente(idUsuario).subscribe(data => {
      this.puntos_descuento = data[0].puntos_descuento
    });
  }
}
