import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { OrdenService } from 'src/app/services/orden.service';
declare let alertify:any;

@Component({
  selector: 'app-pedidos-completados',
  templateUrl: './pedidos-completados.component.html',
  styleUrls: ['./pedidos-completados.component.css']
})
export class PedidosCompletadosComponent {

  ordenes:any=[];
  page:number=0;
  size:number=10;
  id_usuario:any;
  model: any;
  date:any=[
    new Date(),
    new Date()
  ]
  constructor (
    private ordenService: OrdenService,
    private datePipe: DatePipe,
  ) {

  }

  ngOnInit() {
    this.date[0].setDate(this.date[0].getDate() - 30);
    this.id_usuario = parseInt(sessionStorage.getItem('id_usuario') ?? '');
    
    this.getOrdenesCompletadas();
  }

  onValueChange(value: any): void {
    this.date = value;
  }
  getOrdenesCompletadas() {
    this.ordenService.getOrdenesByIdUsuarioAndStatus(this.id_usuario, '5', this.page, this.size, this.date).subscribe(data=>{
      this.ordenes = data;

      //console.log(this.ordenes);
    });    
  }

  formatearFecha(fecha: string) {
    return this.datePipe.transform(fecha, 'dd MMM - hh:mm:ss aaaa')!.toLowerCase();
  }

  formatearCodigo(codigo: string) {
    return codigo.slice(0, 8) + "...";
  }

}
