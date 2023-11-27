import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, tap } from 'rxjs';
import { CarritoService } from 'src/app/services/carrito.service';
import { TaperService } from 'src/app/services/taper.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  private _taperService: TaperService;

  op_cart:boolean = false;
  nombreUsuario:any;
  apellidosUsuario:any;
  token:any;
  iteracion1 = 0;
  iteracion2 = 0;

  productos:any[] =[];
  contador:any;
  cantidad:number = 1;
  subtotal:number = 0;
  mappedAcomps:any[]=[];


  @ViewChild('cart') cart:any;
  @ViewChild('cantidad_producto') cantidad_producto:any;

  @Output() updateSubTotalCarrito = new EventEmitter<void>();
  
  constructor(
    private carritoService: CarritoService, 
    taperService: TaperService,
    private render: Renderer2,
    private router: Router,
  ) {
    this._taperService = taperService;
  }

  ngOnInit(): void {
    this.obtenerDatos();
    
    // Listar productos de forma asíncrona
    this.carritoService.carrito.subscribe(carrito => {
      this.productos = carrito;
      this.contarProductos(this.productos);
    });

    //console.log(this.productos);
    this.getSubTotalCarrito();
    this.getCantidadProdsCarrito();

    // Ejecuta el método obtenerCarrito() cuando se haya cargado completamente la página
    // Sirve también para actualizaciones de la página
    /*
    this.elementRef.nativeElement.ownerDocument.defaultView.addEventListener('load', () => {
      this.carritoService.carrito.subscribe(carrito => {
        this.productos = carrito;
        this.contarProductos();
      });
    });
    */
  }

  get taperService(): TaperService {
    return this._taperService;
  }

  open_modalcart() {
    if (!this.op_cart) {
      this.op_cart = true;
      this.render.addClass(this.cart.nativeElement,'show');
    } else {
      this.op_cart = false;
      this.render.removeClass(this.cart.nativeElement,'show');
    }
  }

  
  obtenerDatos() {
    this.nombreUsuario = sessionStorage.getItem('nombre') ?? '';
    this.apellidosUsuario = sessionStorage.getItem('apellidos') ?? '';
    this.token = sessionStorage.getItem('token') ?? '';
  }

  eliminarProductoCarrito(index:number) {

    this.carritoService.eliminarProductoCarrito(index);

    this.actualizarCantidadTaper(index);

    this.actualizarContadorTotal();
    this.actualizarSubtotalCarrito();

    this.updateSubTotalCarrito.emit();
    
  }

  cerrarSesion() {
    this.navigateToHomeAndReload();
    sessionStorage.clear();
  }

  navigateToHomeAndReload() {
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  contarProductos(prods:any[]) {

    prods.forEach(e => {
      this.contador = this.contador + e.cantidad_producto;
      //this.contador = this.contador + e.cantidad_producto + (this.taperService.taper.cantidad_taper == undefined ? 0 : this.taperService.taper.cantidad_taper);
    });
    //console.log(this.contador);

  }

  incrementar(indice: number) {
    this.productos[indice].cantidad_producto++;

    this.actualizarCantidadTaper(indice);

    this.actualizarSubtotal(indice);
    this.actualizarContadorTotal();
    this.actualizarSubtotalCarrito();

    this.updateSubTotalCarrito.emit();
  }

  disminuir(indice: number) {
    if (this.productos[indice].cantidad_producto > 1) {
      this.productos[indice].cantidad_producto--;

      this.actualizarCantidadTaper(indice);

      this.actualizarSubtotal(indice);
      this.actualizarContadorTotal();
      this.actualizarSubtotalCarrito();

      this.updateSubTotalCarrito.emit();
    }
  }

  // Función para actualizar el subtotal de un producto
  actualizarSubtotal(i: number) {
    this.productos[i].subtotal = this.productos[i].cantidad_producto * this.productos[i].precio_producto;
  }

  // Función para actualizar el contador total
  actualizarContadorTotal() {
    this.contador = this.productos.reduce((total, producto) => total + producto.cantidad_producto, 0);
    //this.contador = this.contador + this.taperService.taper.cantidad_taper;
  }

  // Función para actualizar el subtotal del carrito
  actualizarSubtotalCarrito() {
    this.subtotal = this.productos.reduce((total, producto) => total + producto.subtotal, 0);
    this.subtotal = this.subtotal + (this.taperService.taper.subtotal_taper == undefined ? 0 : Math.round(this.taperService.taper.subtotal_taper));
  }

  actualizarCantidadTaper(indice:number) {

            this.carritoService.carrito.subscribe(data => {
              
                  this.taperService.taper.cantidad_taper = 0;
                  this.taperService.taper.subtotal_taper = 0;

                  if (data.length == 0) {
                    this.taperService.taper.cantidad_taper = 0;
                    this.taperService.taper.subtotal_taper = 0;
                    
                  } else {
                    data.forEach(producto => {
                      if (
                        producto.id_categoria == 9 ||  // Papas
                        producto.id_categoria == 7 ||  // Salchipapas
                        producto.id_categoria == 6 ||  // Tacos
                        producto.id_categoria == 3 ||  // Broaster
                        producto.id_categoria == 2 // Alitas
                      ) 
                       {
                        this.taperService.taper.cantidad_taper = this.taperService.taper.cantidad_taper + producto.cantidad_producto;
                      }
        
                      if (
                        producto.id_categoria == 19 || // Sandwichs
                        producto.id_categoria == 14 // Hamburguesas
                      ) {
                        //console.log("a." + this.taperService.taper.cantidad_taper);
                        this.taperService.taper.cantidad_taper = this.taperService.taper.cantidad_taper + 0.5 * producto.cantidad_producto;
                        //console.log("b." + this.taperService.taper.cantidad_taper);
                      }
        
                      
                      if (
                          producto.id_categoria == 9 ||  // Papas
                          producto.id_categoria == 7 ||  // Salchipapas
                          producto.id_categoria == 6 ||  // Tacos
                          producto.id_categoria == 3 ||  // Broaster
                          producto.id_categoria == 2 // Alitas
                        ) {
                          this.taperService.taper.subtotal_taper = this.taperService.taper.subtotal_taper + producto.cantidad_producto;
                        }
        
                        if (
                          producto.id_categoria == 19 || // Sandwichs
                          producto.id_categoria == 14 // Hamburguesas
                        ) {
                          this.taperService.taper.subtotal_taper = this.taperService.taper.subtotal_taper + 0.5 * producto.cantidad_producto;
                        }
        
                        if (this.taperService.taper.subtotal_taper >= 5) {
                          this.taperService.taper.subtotal_taper = 4
                        }
        
                        if (this.taperService.taper.cantidad_taper >= 4) {
                          this.taperService.taper.subtotal_taper = 4
                        }
                    });
                  }

                  
                //}
              //}

            });

            console.log(this.taperService.taper.cantidad_taper);

            //this.taperService.taper.cantidad_taper = Math.round(this.taperService.taper.cantidad_taper);
            //this.taperService.taper.subtotal_taper = Math.round(this.taperService.taper.subtotal_taper);

  }

  /*
  eliminarTaper() {

    let productos:any;

    this.carritoService.carrito.subscribe(data => {
              console.log(this.productos);
              //if (indice !== -1) {
                // Se coloco este if porque siempre se suscribe cuando hay cambios en el carrito
                // a pesar que en este caso, solo debe suscribirse cuando se interactue con ciertos id_categoria
                
                if (this.productos[indice].id_categoria == 19 ||
                  this.productos[indice].id_categoria == 14 ||
                  this.productos[indice].id_categoria == 9 ||
                  this.productos[indice].id_categoria == 7 ||
                  this.productos[indice].id_categoria == 6 ||
                  this.productos[indice].id_categoria == 3 ||
                  this.productos[indice].id_categoria == 2) 
                {
                this.taperService.taper.cantidad_taper = 0;
                this.taperService.taper.subtotal_taper = 0;
    
                data.forEach(producto => {
        
                  if (
                    producto.id_categoria == 9 ||  // Papas
                    producto.id_categoria == 7 ||  // Salchipapas
                    producto.id_categoria == 6 ||  // Tacos
                    producto.id_categoria == 3 ||  // Broaster
                    producto.id_categoria == 2 // Alitas
                  ) 
                   {
                    this.taperService.taper.cantidad_taper = this.taperService.taper.cantidad_taper + producto.cantidad_producto;
                  }
    
                  if (
                    producto.id_categoria == 19 || // Sandwichs
                    producto.id_categoria == 14 // Hamburguesas
                  ) {
                    this.taperService.taper.cantidad_taper = this.taperService.taper.cantidad_taper + 0.5 * producto.cantidad_producto;
                  }
    
                  
                  if (
                      producto.id_categoria == 9 ||  // Papas
                      producto.id_categoria == 7 ||  // Salchipapas
                      producto.id_categoria == 6 ||  // Tacos
                      producto.id_categoria == 3 ||  // Broaster
                      producto.id_categoria == 2 // Alitas
                    ) {
                      this.taperService.taper.subtotal_taper = this.taperService.taper.subtotal_taper + producto.cantidad_producto;
                    }
    
                    if (
                      producto.id_categoria == 19 || // Sandwichs
                      producto.id_categoria == 14 // Hamburguesas
                    ) {
                      this.taperService.taper.subtotal_taper = this.taperService.taper.subtotal_taper + 0.5 * producto.cantidad_producto;
                    }
    
                    if (this.taperService.taper.subtotal_taper >= 5) {
                      this.taperService.taper.subtotal_taper = 4
                    }
    
                    if (this.taperService.taper.cantidad_taper >= 4) {
                      this.taperService.taper.subtotal_taper = 4
                    }
                });
              
              }
          });
  }*/
  

  getSubTotalCarrito() {
    this.carritoService.carrito.pipe(map(productos => {
      return productos.reduce((prev, curr) => prev + curr.subtotal, 0);
    })).subscribe(subtotal => {
      this.subtotal = subtotal + (this.taperService.taper.subtotal_taper == undefined ? 0 : Math.round(this.taperService.taper.subtotal_taper));
    });
  }

  getCantidadProdsCarrito() {
    this.carritoService.carrito.pipe(map(productos => {
      // Inicializa una variable para llevar el conteo total de productos.
      let cantidadTotal = 0;

      // Recorre la lista de productos y suma la cantidad de cada uno.
      productos.forEach(producto => {
          cantidadTotal += producto.cantidad_producto;
      });

      // Devuelve la cantidad total.
      return cantidadTotal;

    })).subscribe(cantidad_producto => {
      this.contador = cantidad_producto;
      //this.contador = cantidad_producto + (this.taperService.taper.cantidad_taper == undefined ? 0 : this.taperService.taper.cantidad_taper);

    });
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

}
