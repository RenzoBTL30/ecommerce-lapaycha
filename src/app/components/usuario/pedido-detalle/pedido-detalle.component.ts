import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { OrdenService } from 'src/app/services/orden.service';
declare let alertify:any;

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.component.html',
  styleUrls: ['./pedido-detalle.component.css']
})
export class PedidoDetalleComponent {

  orden:any = {};
  productos:any[]=[];
  nota_adicional?:string;
  mappedAcomps:any[]=[];

  constructor(
    private route: ActivatedRoute, 
    private ordenService: OrdenService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.obtenerInfoPedido();
  }

  obtenerInfoPedido(){
    this.route.params.subscribe(
      e=>{
        let id=e['id'];
        if (id) {
          this.ordenService.getOrdenById(id).subscribe(
            es=>{
              this.orden=es[0];
              this.productos = this.orden.productos;
              console.log(this.productos);
            }
          );
        }
      }
    )
  }

  formatearFecha(fecha: string) {
    return this.datePipe.transform(fecha, 'dd MMM YYYY - hh:mm:ss aaaa')?.toLowerCase();
  }


  categorizarPorTipoAcomps(acomps:any[]) {

    this.mappedAcomps = acomps.reduce((acc, curr) => {
    const existingItem = acc.find((item: { tipo: any; }) => item.tipo === curr.tipo);
    
      if (existingItem) {
        existingItem.acompanamientos.push({
          id_acompanamiento: curr.id_acompanamiento,
          acompanamiento: curr.acompanamiento,
          precio: curr.precio,
          tipo: curr.tipo
        });
      } else {
        acc.push({
          tipo: curr.tipo,
          acompanamientos: [{
            id_acompanamiento: curr.id_acompanamiento,
            acompanamiento: curr.acompanamiento,
            precio: curr.precio,
            tipo: curr.tipo,
          }]
        });
      }
    
      return acc;
    }, []);

    return this.mappedAcomps;
  }

  calcularNuevoPrecioProducto(precio_producto:any, acomps:any[], combos:any[]) {
    let nuevoPrecio = precio_producto;

    if (acomps) {
      acomps.forEach(e => {
        nuevoPrecio = nuevoPrecio + e.precio
      });
    }

    if (combos) {
      combos.forEach(e => {
        nuevoPrecio = nuevoPrecio + e.precio
      });
    }
    
    return nuevoPrecio;
  }

  verNotaAdicional(nota_adicional:string) {
    this.nota_adicional = nota_adicional;
  }
}
