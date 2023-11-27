import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrdenService } from 'src/app/services/orden.service';
declare let alertify:any;

@Component({
  selector: 'app-pedidos-completados',
  templateUrl: './pedidos-completados.component.html',
  styleUrls: ['./pedidos-completados.component.css']
})
export class PedidosCompletadosComponent {

  ordenes:any[]=[];

  id_usuario:any;

  constructor (
    private ordenService: OrdenService,
    private datePipe: DatePipe,
  ) {

  }
  

  ngOnInit() {
    this.id_usuario = parseInt(sessionStorage.getItem('id_usuario') ?? '');
    
    this.getOrdenesAll();
  }

  getOrdenesAll() {
    this.ordenService.getOrdenesAll(this.id_usuario).subscribe(data=>{
      this.ordenes = data;
      console.log(this.ordenes);
    });    
  }

  formatearFecha(fecha: string) {
    return this.datePipe.transform(fecha, 'dd-MM-yyyy HH:mm:ss');
  }

}
