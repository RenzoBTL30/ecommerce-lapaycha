import { AfterViewChecked, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, interval, map, takeUntil, takeWhile, timer } from 'rxjs';
import { CarritoService } from 'src/app/services/carrito.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { FormasEntregaService } from 'src/app/services/formas-entrega.service';
import { LugarService } from 'src/app/services/lugar.service';
import { MetodosPagoService } from 'src/app/services/metodos-pago.service';
import { OrdenService } from 'src/app/services/orden.service';
import { OrdenesSocketService } from 'src/app/services/ordenes-socket.service';
import { TaperService } from 'src/app/services/taper.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy  {

  private _taperService: TaperService;
  private destroy$ = new Subject<void>(); // Subject para gestionar la destrucción del componente

  id_usuario:any;

  productos:any[] =[];
  contador:any;
  cantidad:number = 1;
  subtotal:number = 0;
  comision:number = 0;
  total:number = 0;

  metodosPago:any[]=[];
  formasEntrega:any[]=[];
  lugares:any[]=[];
  direccion:any = {};
  direcciones:any[]=[];

  id_forma_entrega:any;
  id_metodo_pago:any;
  lugar:any;
  id_direccion:any = 0;
  billete_pago:any;
  comprobante_pago:any;

  mappedAcomps:any[]=[];

  orden:any= {};
  notification:string = '';
  puntos_usuario?:number;
  puntos_descuento?:any;
  puntos_usados:number = 0;
  puntos_ganados:number = 0;
  puntos_restantes?:number;
  existPoints:boolean = false;
  descuento:number = 0;

  @ViewChildren('accordionItems') accordionItems: any;
  @ViewChild('direccionSelect') direccionSelect?: ElementRef;

  constructor (
    private carritoService: CarritoService,
    private formasEntregaService: FormasEntregaService,
    private metodosPagoService: MetodosPagoService,
    private direccionService: DireccionesService,
    private ordenService: OrdenService,
    private clienteService: ClienteService,
    private lugarService: LugarService,
    private ordenesSocket: OrdenesSocketService,
    private router: Router,
    taperService: TaperService,
    private toastr: ToastrService,
    ) {
    this._taperService = taperService;
  }

  ngOnInit(): void {

    this.direccion.id_lugar = 0;
    this.ordenesSocket.conectar();

    this.id_usuario = sessionStorage.getItem('id_usuario');
    // Listar productos de forma asíncrona
    this.carritoService.carrito.subscribe(carrito => {
      this.productos = carrito;
      this.contarProductos(this.productos);
    });

    this.getSubTotalCarrito();
    this.getCantidadProdsCarrito();
    this.getFormasEntrega();
    this.getMetodosPago();
    this.getDirecciones();
    this.getLugares();
    this.obtenerPuntosDescuentoUsuario();
    this.calcularPuntosGanados();
  }

  ngOnDestroy(): void {
    this.ordenesSocket.desconectar();
    this.destroy$.next();
    this.destroy$.complete();
  }


  get taperService(): TaperService {
    return this._taperService;
  }

  contarProductos(prods:any[]) {
    prods.forEach(e => {
      this.contador = this.contador + e.cantidad;
    });
  }

  getSubTotalCarrito() {
    this.carritoService.carrito.pipe(map(productos => {
      return productos.reduce((prev, curr) => prev + curr.subtotal, 0);
    })).subscribe(subtotal => {
      this.subtotal = subtotal + Math.round(this.taperService.taper.subtotal_taper);
      this.updateTotalOrden();
      this.calcularPuntosGanados();
    });
  }

  getCantidadProdsCarrito() {
    this.carritoService.carrito.pipe(map(productos => {
      // Inicializa una variable para llevar el conteo total de productos.
      let cantidadTotal = 0;

      // Recorre la lista de productos y suma la cantidad de cada uno.
      productos.forEach(producto => {
          cantidadTotal += producto.cantidad;
      });
      
      // Devuelve la cantidad total.
      return cantidadTotal;

    })).subscribe(cantidad => {
      this.contador = cantidad;
    });
  }
  
  getFormasEntrega() {
    this.formasEntregaService.getFormaEntregas().subscribe(data => {
      this.formasEntrega = data;
    });
  }

  getMetodosPago() {
    this.metodosPagoService.getMetodosPago().subscribe(data => {
      this.metodosPago = data;
    });
  }

  onFormaEntregaSeleccionada() {
    if (this.id_forma_entrega != 2) {
      this.id_direccion = "";
      this.lugar = "";
      this.comision = 0;
      this.updateTotalOrden();
      this.calcularPuntosGanados();
    }
  }

  onMetodoPagoSeleccionado() {
    if (this.id_metodo_pago != 1) {
      this.billete_pago = "";
    }
  }

  getDirecciones() {
    this.direccionService.getDireccionesPorUsuario(this.id_usuario).subscribe(data => {
      this.direcciones = data;
    });
  }

  onDireccionSeleccionada() {
    // Obtén la dirección seleccionada
    const direccionSeleccionada = this.direcciones.find(d => d.id_direccion === this.id_direccion);

    if (direccionSeleccionada) {
      this.lugar = direccionSeleccionada.lugar;
      this.comision = direccionSeleccionada.comision;
      this.updateTotalOrden();
      this.calcularPuntosGanados();
    }
  }

  
  registrarOrden() {

    if (this.isValidCheckout()) {

      this.productos.forEach(producto => {
        producto.acompanamientos.forEach((acompanamiento: { tipo_seleccion: any; limite_opciones: any; }) => {
          // Eliminar las propiedades tipo_seleccion y limite_opciones
          delete acompanamiento.tipo_seleccion;
          delete acompanamiento.limite_opciones;
        });
      });
            
      this.orden = {
        id_usuario: parseInt(this.id_usuario),
        id_direccion: parseInt(this.id_direccion == "" ? null : this.id_direccion),
        id_metodo_pago: parseInt(this.id_metodo_pago),
        id_forma_entrega: parseInt(this.id_forma_entrega),
        billete_pago: this.billete_pago == "" ? null : this.billete_pago,
        cantidad_tapers: this.taperService.taper.cantidad_taper == 0 ? null : Math.round(this.taperService.taper.cantidad_taper),
        puntos_canjeados: this.puntos_usados == 0 ? null : parseInt(this.puntos_usados.toString()),
        subtotal: this.subtotal - Math.round(this.taperService.taper.subtotal_taper), //Se hace la resta porque el subtotal ya incluye el subtotal de los tapers (linea 90)
        //total_acomp: this.total_acomps,
        //total_combo: this.total_combos,
        total_tapers: this.taperService.taper.subtotal_taper == 0 ? null : Math.round(this.taperService.taper.subtotal_taper),
        descuento: this.descuento == 0 ? null : Number(this.descuento),
        total: this.total,
        comprobante_pago: this.comprobante_pago == "" ? null : this.comprobante_pago,
        puntos_ganados: this.puntos_ganados,
        productos: this.productos
      }

      console.log(this.orden);
      
      
      this.ordenService.registrarOrden(this.orden).subscribe(res => {
        this.toastr.success('Pedido registrado correctamente');

        this.notification = 'Un nuevo pedido ha sido realizado';
        this.ordenesSocket.notificarNuevaOrdenPendiente(this.notification);

        this.taperService.taper.cantidad_taper = 0;
        this.taperService.taper.subtotal_taper = 0;
        this.canjearPuntos();
        this.vaciarCarrito();

        this.navigateToPedidoRealizado();
      });
      
      
    }
    
    
  }

  navigateToPedidoRealizado() {
    this.router.navigate(['/pedido-realizado']);
  }

  isValidCheckout(): boolean {
    // El formulario no es válido, por lo que realizamos la validación manual de campos
      if (this.productos.length == 0) {
        this.toastr.warning('Carrito vacío: Debes seleccionar productos');
        return false;
      } 

      if (!this.id_forma_entrega) {
        this.toastr.warning('Debes escoger una forma de entrega');
        return false;
      }

      if (this.id_forma_entrega == 2) {
        if (!this.id_direccion) {
          this.toastr.warning('Debes escoger una dirección');
          return false;
        }
      }

      if (!this.id_metodo_pago) {
        this.toastr.warning('Debes escoger un método de pago');
        return false;
      }

      if (this.id_metodo_pago == 1) {
        if (!this.billete_pago) {
          this.toastr.warning('Debes indicar el billete de pago');
          return false;
        }
      }

      return true;
  }

  updateTotalOrden() {
    this.total = this.subtotal + this.comision;

    if (this.total < this.descuento) {
      this.total = 0;
    } else {
      this.total = this.total - this.descuento;
    }
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

  obtenerPuntosDescuentoUsuario() {
    let idUsuario = parseInt(sessionStorage.getItem('id_usuario') ?? '');

    this.clienteService.getDatosCliente(idUsuario).subscribe(data => {
      this.puntos_usuario = data[0].puntos_descuento;
    });
  }

  isValidPointsForCanje() {
    if (!this.puntos_descuento) {
      this.toastr.warning('Tienes que ingresar tus puntos');
      return false;
    }

    if (this.puntos_descuento < 100) {
      this.toastr.warning('Solo puedes canjear a partir de 100 puntos');
      return false;
    }

    if (!this.validarSoloNumeros(this.puntos_descuento)) {
      this.toastr.warning('Tienes que ingresar números');
      return false;
    }

    return true;
  }

  aplicarPuntosParaDescuento() {
    let idUsuario = parseInt(sessionStorage.getItem('id_usuario') ?? '');

    if (this.isValidPointsForCanje()) {
      this.puntos_restantes = this.puntos_usuario! - this.puntos_descuento;
      this.existPoints = true;

      this.ordenService.aplicarPuntosParaDescuento(idUsuario, this.puntos_descuento!).subscribe({
        next: (response) => {
          console.log(response);
          this.puntos_usados = this.puntos_descuento;
          this.descuento = response.descuento;
          this.updateTotalOrden();
          this.calcularPuntosGanados();
        },
        error: (e) => {
          this.toastr.error(e.error);
          this.cancelarAplicarPuntos();
          this.updateTotalOrden();
          this.calcularPuntosGanados();
        }
        
      });
    }
  }

  calcularPuntosGanados() {

    this.puntos_ganados = Math.floor(this.total);

    /* Este codigo envia el total al backend y a través de un procedimiento se hace el mismo calculo de la linea 376 
    Se comento porque podria ser ineficiente hacer muchas peticiones al backend, por tanto el calculo se puede hacer en el front
    Se puede considerar usar el codigo comentado por un tema de seguridad, pero se puede hacer una validacion al momento de crear la orden*/
    /*
    this.ordenService.calcularPuntosGanados(this.total).subscribe({
        next: (response) => {
          console.log(response);
          this.puntos_ganados = response.puntos_ganados;
        },
        error: (e) => {
          this.toastr.error(e.error);
        }
        
    });
    */
  }

  canjearPuntos() {
    let idUsuario = parseInt(sessionStorage.getItem('id_usuario') ?? '');

    this.ordenService.canjearPuntos(idUsuario, this.puntos_descuento!).subscribe({
      next: (response) => {
        this.cancelarAplicarPuntos();
      },
      error: (e) => {
        this.cancelarAplicarPuntos();
      }
    });
  }

  registrarDireccion() {
    if (this.isValidForm()) {
      this.direccionService.registrarDireccion(this.direccion, this.id_usuario).subscribe(response => {
        this.toastr.success('Dirección registrada correctamente');

        // Asigna el ID de la dirección recién registrada
        this.id_direccion = response.data;

        //Luego de obtener el id_direccion del response, se lista de nuevo las direcciones
        this.direccionService.getDireccionesPorUsuario(this.id_usuario).subscribe(data => {
          this.direcciones = data;

          // Actualiza manualmente la referencia después de asignar el valor a id_direccion
          // Si el "==" se cambia a "===" no funcionará, debido a que el === es estricto en los tipos de variable. Sucede porque el d.id_direccion es texto y el this.id_direccion es number
          const direccionSeleccionada = this.direcciones.find(d => d.id_direccion == this.id_direccion);

          if (direccionSeleccionada) {
            this.lugar = direccionSeleccionada.lugar;
            this.comision = direccionSeleccionada.comision;
            this.updateTotalOrden();
            this.calcularPuntosGanados();
          }
        });

      this.limpiar();
      });
    }
  }

  isValidForm(): boolean {
    if (!this.direccion.direccion) {
      this.toastr.warning('El campo Dirección es obligatorio');
      return false;
    }
    if (!this.direccion.id_lugar) {
      this.toastr.warning('El campo Referencia es obligatorio');
      return false;
    }
    return true;
  }

  validarSoloNumeros(cadena: string): boolean {
    const regexSoloNumeros = /^[0-9]+$/;
    return regexSoloNumeros.test(cadena);
  }

  cancelarAplicarPuntos() {
    this.puntos_descuento = '';
    this.puntos_usados = 0;
    this.descuento = 0;
    this.puntos_ganados = 0;
    this.existPoints = false;
    this.updateTotalOrden();
    this.calcularPuntosGanados();
  }

  getLugares() {
    this.lugarService.getLugares().subscribe(data => {
      this.lugares = data;
    });
  }

  vaciarCarrito() {
    this.carritoService.vaciarCarrito();
  }

  limpiar() {
    this.direccion.direccion = '';
    this.direccion.id_lugar = '';
  }
}
