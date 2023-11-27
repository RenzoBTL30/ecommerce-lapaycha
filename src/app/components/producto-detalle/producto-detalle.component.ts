import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs';
import { Taper } from 'src/app/models/taper';
import { AcompanamientoService } from 'src/app/services/acompanamiento.service';
import { CarritoService } from 'src/app/services/carrito.service';
import { ComboService } from 'src/app/services/combo.service';
import { ProductoService } from 'src/app/services/producto.service';
import { TaperService } from 'src/app/services/taper.service';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.component.html',
  styleUrls: ['./producto-detalle.component.css']
})
export class ProductoDetalleComponent {

  producto:any;
  acomps:any[] =[];
  combos:any[] =[];
  salsas: any[] = [];
  tamanios: any[] = [];
  token:any;

  nota_adicional?:string;

  mappedAcomps:any[]=[];

  selectedAcompanamientos: any[] = [];
  selectedCombos: any[] = [];

  cantidad:number = 1;
  cantTaperTemp?:number;

  productos:any[]=[];
  categoriasFiltradas: any[] = [];

  subtotal_producto:any;

  @ViewChild('cantidad_producto') cantidad_producto:any;
  //@ViewChild('subtotal_producto') subtotal_producto:any;

  prod_carrito = {
    id_producto: 0,
    nombre_producto: "",
    precio_producto: 0,
    imagen: "",
    cantidad_producto: 0,
    nota_adicional: "",
    subtotal: 0,
    acompanamientos: [] as any[],
    combos: [] as any[],
    id_categoria: 0
  };
  limite: any;


  constructor(
    private route: ActivatedRoute, 
    private prodService: ProductoService, 
    private acompService: AcompanamientoService,
    private comboService: ComboService,
    private carritoService: CarritoService,
    private taperService: TaperService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.obtenerInfoProducto();
    this.obtenerToken();
  }

  obtenerInfoProducto(){
    this.route.params.subscribe(
      e=>{
        let id=e['id'];
        if (id) {
          this.prodService.getProductosById(id).subscribe(
            es=>{
              this.producto=es[0];
              //console.log(this.producto);
              this.calcularSubtotalProducto();
            }
          );
          this.listarAcomps(id);
          this.listarCombos(id);
        }
      }
    )
  }

  categorizarPorTipoAcomps(acomps:any[]) {

    /* Ya no es necesario por el codigo de las líneas 85-106

    acomps.forEach(e => {
      const tipo = e.tipo;
      if (!this.acompsCategorizadas![tipo]) {
        this.acompsCategorizadas[tipo] = [];
      }
      this.acompsCategorizadas![tipo].push(e);
    });
    */

    this.mappedAcomps = acomps.reduce((acc, curr) => {
    const existingItem = acc.find((item: { tipo: any; }) => item.tipo === curr.tipo);
    
      if (existingItem) {
        existingItem.acompanamientos.push({
          id_acompanamiento: curr.id_acompanamiento,
          acompanamiento: curr.acompanamiento,
          precio: curr.precio,
          tipo: curr.tipo,
          tipo_seleccion: curr.tipo_seleccion,
          limite_opciones: curr.limite_opciones,
        });
      } else {
        acc.push({
          tipo: curr.tipo,
          tipo_seleccion: curr.tipo_seleccion,
          limite_opciones: curr.limite_opciones,
          acompanamientos: [{
            id_acompanamiento: curr.id_acompanamiento,
            acompanamiento: curr.acompanamiento,
            precio: curr.precio,
            tipo: curr.tipo,
            tipo_seleccion: curr.tipo_seleccion,
            limite_opciones: curr.limite_opciones,
          }]
        });
      }
    
      return acc;
    }, []);
    console.log(this.mappedAcomps);
  }

  listarAcomps(id_producto:any) {
    this.acompService.listarProdsAcomp(id_producto).subscribe((data) => {
      this.acomps = data;
      this.categorizarPorTipoAcomps(this.acomps);
    })
  }

  listarCombos(id_producto:any) {
    this.comboService.listarProdsCombo(id_producto).subscribe((data) => {
      this.combos = data;
    })
  }

  obtenerToken() {
    this.token = sessionStorage.getItem('token') ?? '';
  }

  onCheckboxChange(event: any) {
    console.log(event);
  }

  incrementar() {
    this.cantidad = this.cantidad + 1;
    this.calcularSubtotalProducto();
  }

  disminuir() {
    if (this.cantidad > 1) {
      this.cantidad = this.cantidad - 1;
    }
    this.calcularSubtotalProducto();
  }

  toggleAcompanamientoMultiple(acompanamiento:any): void {
    const index = this.selectedAcompanamientos.indexOf(acompanamiento);
    if (index === -1) {
      this.selectedAcompanamientos.push(acompanamiento);
    } else {
      this.selectedAcompanamientos.splice(index, 1);
    }
    console.log(this.selectedAcompanamientos);
    this.calcularSubtotalProducto();
  }

  toggleAcompanamientoUnico(acompanamiento: any): void {

    let index = this.selectedAcompanamientos.findIndex(a => a.acompanamiento == acompanamiento.acompanamiento);
    let isExistAcomp = this.selectedAcompanamientos.some(a => a.tipo_seleccion == 'Unica');

    if (index === -1 && !isExistAcomp) {
      this.selectedAcompanamientos.push(acompanamiento);
    }

    if (isExistAcomp) {
      let index = this.selectedAcompanamientos.findIndex(a => a.tipo_seleccion == 'Unica');
      this.selectedAcompanamientos[index] = acompanamiento;
    }

    console.log(this.selectedAcompanamientos);
    this.calcularSubtotalProducto();
    
  }

  toggleComboMultiple(combo:any): void {
    const index = this.selectedCombos.indexOf(combo);
    if (index === -1) {
      this.selectedCombos.push(combo);
    } else {
      this.selectedCombos.splice(index, 1);
    }
    console.log(this.selectedCombos);
    this.calcularSubtotalProducto();
  }
  
  agregarProductoAlCarrito() {

    // Verificar límite de opciones para cada tipo de acompañamiento
    const tipoMultiple = this.selectedAcompanamientos.filter(acomp => acomp.tipo_seleccion === 'Multiple');

    let superaLimite = false;

    // Verificar límite para tipo Multiple
    tipoMultiple.forEach(acomp => {
      const limite = acomp.limite_opciones || Infinity;
      if (this.selectedAcompanamientos.filter(a => a.tipo === acomp.tipo).length > limite) {
        superaLimite = true;
      }
      this.limite = limite;
    });

    if (superaLimite) {
      this.toastr.warning(`Debes seleccionar máximo ${this.limite} opciones`, '', {
        positionClass: 'toast-top-center'
      });
    } else {
      this.prod_carrito.id_producto = this.producto.id_producto;
      this.prod_carrito.nombre_producto = this.producto.nombre;
      this.prod_carrito.precio_producto = this.calcularNuevoPrecioProducto();
      this.prod_carrito.cantidad_producto = this.cantidad;
      this.prod_carrito.nota_adicional = this.nota_adicional!;
      //this.prod_carrito.subtotal = parseFloat(this.subtotal_producto.nativeElement.textContent);
      this.prod_carrito.subtotal = this.subtotal_producto
      this.prod_carrito.acompanamientos = this.selectedAcompanamientos;
      this.prod_carrito.combos = this.selectedCombos;
      this.prod_carrito.id_categoria = this.producto.id_categoria;

      console.log(this.prod_carrito);

      this.agregarTaper();
      this.carritoService.agregarProductoAlCarrito(this.prod_carrito);
      this.toastr.success("Producto agregado", '', {
        positionClass: 'toast-top-center'
      });
    }

    
    
  }

  agregarTaper() {

    if (
      this.producto.id_categoria === 19 || // Sandwichs
      this.producto.id_categoria === 14 || // Hamburguesas
      this.producto.id_categoria === 9 ||  // Papas
      this.producto.id_categoria === 7 ||  // Salchipapas
      this.producto.id_categoria === 6 ||  // Tacos
      this.producto.id_categoria === 3 ||  // Broaster
      this.producto.id_categoria === 2     // Alitas
    ) {
    
      if (this.producto.id_categoria == 9 ||  // Papas
        this.producto.id_categoria == 7 ||  // Salchipapas
        this.producto.id_categoria == 6 ||  // Tacos
        this.producto.id_categoria == 3 ||  // Broaster
        this.producto.id_categoria == 2 // Alitas
      ) {
        this.taperService.taper.cantidad_taper = this.taperService.taper.cantidad_taper + this.cantidad;
      }

      if (this.producto.id_categoria == 19 || // Sandwichs
        this.producto.id_categoria == 14 // Hamburguesas
      ) {
        this.taperService.taper.cantidad_taper = this.taperService.taper.cantidad_taper + 0.5 * this.cantidad;
      }

      //if (this.taper.cantidad_producto < 4) {

      if (
        this.producto.id_categoria == 9 ||  // Papas
        this.producto.id_categoria == 7 ||  // Salchipapas
        this.producto.id_categoria == 6 ||  // Tacos
        this.producto.id_categoria == 3 ||  // Broaster
        this.producto.id_categoria == 2 // Alitas
      ) {
        this.taperService.taper.subtotal_taper = this.taperService.taper.subtotal_taper + this.cantidad;
      }

      if (this.producto.id_categoria == 19 || // Sandwichs
          this.producto.id_categoria == 14 // Hamburguesas
      ) {
        this.taperService.taper.subtotal_taper = this.taperService.taper.subtotal_taper + 0.5 * this.cantidad;
      }

      if (this.taperService.taper.subtotal_taper >= 5) {
        this.taperService.taper.subtotal_taper = 4;
      }

      if (this.taperService.taper.cantidad_taper >= 4) {
        this.taperService.taper.subtotal_taper = 4
      }
      //}
    }
    //this.taperService.taper.cantidad_taper = Math.round(this.taperService.taper.cantidad_taper);
    //this.taperService.taper.subtotal_taper = Math.round(this.taperService.taper.subtotal_taper);
  }

  calcularNuevoPrecioProducto() {
    let nuevoPrecio = parseFloat(this.producto.precio);

    if (this.selectedAcompanamientos.length !== 0) {
      this.selectedAcompanamientos.forEach(e => {
        nuevoPrecio = nuevoPrecio + e.precio
      });
    }

    if (this.selectedCombos.length !== 0) {
      this.selectedCombos.forEach(e => {
        nuevoPrecio = nuevoPrecio + e.precio
      });
    }
    
    return nuevoPrecio;
  }

  calcularSubtotalProducto() {
    /* --- Se creo un metodo para este código ---
    let nuevoPrecio = parseFloat(this.producto.precio);

    if (this.selectedAcompanamientos.length !== 0) {
      this.selectedAcompanamientos.forEach(e => {
        nuevoPrecio = nuevoPrecio + e.precio
      });
    }

    this.subtotal_producto = nuevoPrecio * this.cantidad;
    */
    
    this.subtotal_producto = this.calcularNuevoPrecioProducto() * this.cantidad;
  }
}
