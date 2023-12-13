import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { ProductosSocketService } from 'src/app/services/productos-socket.service';

@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.css']
})
export class CartaComponent implements OnInit, OnDestroy{

  productos: any[] = [];
  message: string = '';
  isLoading?: boolean;

  constructor(
    private route: ActivatedRoute, 
    private prodService: ProductoService,
    private productosSocket: ProductosSocketService,
    private cdr: ChangeDetectorRef
    ) {
  }

  ngOnInit(): void {
    //this.getProductosByCategoria(1);
    this.productosSocket.conectar();
    
    this.route.params.subscribe(
      e=>{
        let id=e['id'];
        if (id) {
          this.isLoading = true;
          this.prodService.getProductosByCategoria(id).subscribe(
            es=>{
              this.productos=es;
              this.isLoading = false;
            }
          );
        }
      }
    )

    this.productosSocket.recibirNotificacionDisponibilidad().subscribe(response => {
      console.log(response);
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.productosSocket.desconectar();
  }

  /*
  getProductosByCategoria(idCategoria: number) {
    this.isLoading = true;
    this.prodService.getProductosByCategoria(idCategoria).subscribe((data) => {
      this.productos = data;

      // Ordena alfabeticamente el array
      this.productos.sort((a, b) => a.nombre.localeCompare(b.nombre));

      this.isLoading = false;
    });
  }
  */
}
