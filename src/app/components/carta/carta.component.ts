import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-carta',
  templateUrl: './carta.component.html',
  styleUrls: ['./carta.component.css']
})
export class CartaComponent {

  productos: any[] = [];
  isLoading?: boolean;

  constructor(private route: ActivatedRoute, private prodService: ProductoService) { 
    /*
    this.route.params.subscribe(params => {
      const idCategoria = +params['id'];
      this.getProductosByCategoria(idCategoria);
    });
    */
  }

  ngOnInit(): void {
    this.getProductosByCategoria(1);
  }

  getProductosByCategoria(idCategoria: number) {
    this.isLoading = true;
    this.prodService.getProductosByCategoria(idCategoria).subscribe((data) => {
      this.productos = data;

      // Ordena alfabeticamente el array
      this.productos.sort((a, b) => a.nombre.localeCompare(b.nombre));

      this.isLoading = false;
    });
  }
}
