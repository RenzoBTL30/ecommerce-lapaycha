import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CategoriaService } from 'src/app/services/categoria.service';

@Component({
  selector: 'app-navbar-carta',
  templateUrl: './navbar-carta.component.html',
  styleUrls: ['./navbar-carta.component.css']
})
export class NavbarCartaComponent {

  categorias: any[] = [];
  isLoading?: boolean;
  
  //categoriaSeleccionadaId: number | null = null;
  //@Output() categoriaSeleccionada = new EventEmitter<number>();
  
  constructor(private catService: CategoriaService) { }

  ngOnInit(): void {
    this.getCategorias();
  }

  getCategorias() {
    this.isLoading = true;
    this.catService.getCategorias().subscribe((data) => {
      this.categorias = data;

      // Ordena alfabeticamente el array
      this.categorias.sort((a, b) => a.nombre.localeCompare(b.nombre));

      this.isLoading = false;
    });
  }

  // Método para manejar la selección de la categoría y emitir el ID
  /* Forma anterior para seleccionar una categoria (era enviando el idCategoria al padre: carta.component)

  seleccionarCategoria(idCategoria: number) {
    this.categoriaSeleccionadaId = idCategoria;
    this.categoriaSeleccionada.emit(idCategoria);
  }
  */
}
