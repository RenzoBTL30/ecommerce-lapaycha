import { Component, OnInit } from '@angular/core';
import { CarritoService } from 'src/app/services/carrito.service';

@Component({
  selector: 'app-view-pedido-realizado',
  templateUrl: './view-pedido-realizado.component.html',
  styleUrls: ['./view-pedido-realizado.component.css']
})
export class ViewPedidoRealizadoComponent implements OnInit {

  constructor (private carritoService: CarritoService) {

  }
  ngOnInit(): void {
    
  }
}
