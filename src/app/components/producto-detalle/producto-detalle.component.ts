import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent {

  producto:any;


  constructor(private route: ActivatedRoute, private prodService: ProductoService) { }

  ngOnInit(): void {
    this.obtenerInfoProducto();
  }

  obtenerInfoProducto(){
    this.route.params.subscribe(
      e=>{
        let id=e['id'];
        if (id) {
          this.prodService.getProductosById(id).subscribe(
            es=>{
              this.producto=es[0];
            }
          );
        }
      }
    )
  }

}
