import { DatePipe } from '@angular/common';
import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { OrdenService } from 'src/app/services/orden.service';
import { Subject, interval, takeUntil } from 'rxjs';
import * as moment from 'moment-timezone';
import { OrdenesSocketService } from 'src/app/services/ordenes-socket.service';

declare let alertify:any;


@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit, OnDestroy {

  ordenes:any[]=[];
  ordenesConTiempo: any[] = [];
  buttonVisibility: { [key: number]: boolean } = {};
  notification: string = '';

  private destroy$ = new Subject<void>();

  id_usuario:any;

  constructor (
    private ordenService: OrdenService,
    private ordenesSocket: OrdenesSocketService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private zone: NgZone
  ) {

  }
  
  ngOnInit() {
    this.id_usuario = parseInt(sessionStorage.getItem('id_usuario') ?? '');

    this.ordenesSocket.conectar();
    this.getOrdenesAll();

    
    this.ordenesSocket.recibirNotificacionEstadoOrden().subscribe(response => {
      //console.log(response);
      this.getOrdenesAll();
    });
    

    this.ordenesSocket.recibirNotificacionActualizacionTiempoEntrega().subscribe(response => {
      this.getOrdenesAll();
    });

    /*
    this.ordenService.ordenRegistradaSubject.subscribe(response => {
      console.log(response);
      this.buttonVisibility[response.id_orden] = false; // Oculta el botón después de 5 minutos
    });
    */
  }

  ngOnDestroy() {
    this.ordenesSocket.desconectar();
  }

  getOrdenesAll() {
    this.ordenService.getOrdenesAll(this.id_usuario).subscribe(data=>{
      this.ordenes = data;
      //console.log(this.ordenes);
      // Inicializa el temporizador para cada orden
      /*
      this.ordenes.forEach((o) => {
        this.buttonVisibility[o.id_orden] = true;
        //this.hideButtonAfterDelay(o.id_orden, new Date(o.fecha_orden)); // Asegúrate de que la propiedad 'fecha_creacion' exista en tu objeto 'o'
      });
      */
      
    });
  }

  /*
  formatearFecha(fecha: string) {
    // Crear un objeto moment con la fecha proporcionada en formato UTC
    const momentFecha = moment.utc(fecha);

    // Formatear la fecha local sin cambiar la zona horaria
    const fechaFormateada = momentFecha.tz('America/Lima').format('YYYY-MM-DD HH:mm:ss');

    return fechaFormateada;
  }
  */

  formatearFecha(fecha: string) {
    return this.datePipe.transform(fecha, 'dd MMM - hh:mm:ss aaaa')?.toLowerCase();
  }

  formatearCodigo(codigo: string) {
    return codigo.slice(0, 8) + "...";
  }

  cancelarOrden(id_orden:number) {

    alertify.confirm('Confirmación', '¿Estás seguro que quieres cancelar tu pedido?', () => { 
      this.ordenService.cancelarOrden(id_orden).subscribe(response => {
        this.toastr.success('Tu pedido ha sido cancelado');

        this.notification = 'Un pedido ha sido cancelado';
        this.ordenesSocket.notificarOrdenCancelada(this.notification);

        this.getOrdenesAll();
      });
    }, () => { 
      
    }).setting({
      'labels': {ok:'Si', cancel:'No'},
      'movable': false
    })
      
    
  }

  /*
  hideButtonAfterDelay(ordenId: number, tiempoCreacion: Date) {
    const tiempoInicial = tiempoCreacion.getTime();
    const tiempoActual = new Date().getTime();

    const tiempoRestante = 20000 - (tiempoActual - tiempoInicial); // Cambia 300000 a 30000 para 30 segundos
    console.log(tiempoRestante);
    if (tiempoRestante > 0) {
      this.zone.runOutsideAngular(() => {
        setTimeout(() => {
          this.zone.run(() => {
            //console.log(this.buttonVisibility[ordenId]);
            this.buttonVisibility[ordenId] = true;
            //console.log(this.buttonVisibility[ordenId]);
            // Agrega esta línea para imprimir un mensaje en la consola
            console.log(`Botón oculto para la orden ${ordenId} después de 30 segundos.`);
          });
        }, tiempoRestante);
      });
    } else {
      // Si el tiempo restante es negativo o cero, oculta el botón inmediatamente
      this.buttonVisibility[ordenId] = true;
       // Agrega esta línea para imprimir un mensaje en la consola
      console.log(`Botón oculto inmediatamente para la orden ${ordenId}.`);
    }
  }
  */

  
  
}
