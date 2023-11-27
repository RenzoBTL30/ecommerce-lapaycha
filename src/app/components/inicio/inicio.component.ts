import { Component } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
declare var tns:any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  productos:any[]=[]

  constructor (private prodService: ProductoService) {

  }

  ngOnInit(): void {

    setTimeout(()=>{
      tns({
        container: '.cs-carousel-inner',
        controlsText: ['<i class="cxi-arrow-left"></i>', '<i class="cxi-arrow-right"></i>'],
        mode: 'gallery',
        navContainer: '#pager',
        responsive: {
          0: { controls: false },
          991: { controls: true }
        }
      });
  
    },500);

    this.getPromociones();

  }

  getPromociones() {
    this.prodService.getProductosByCategoria(20).subscribe(
      data=>{
        this.productos=data;
      }
    );
  }


  
}
