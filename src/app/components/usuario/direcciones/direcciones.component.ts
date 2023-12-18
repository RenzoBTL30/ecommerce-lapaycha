import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DireccionesService } from 'src/app/services/direcciones.service';
import { LugarService } from 'src/app/services/lugar.service';

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.component.html',
  styleUrls: ['./direcciones.component.css']
})
export class DireccionesComponent implements OnInit {

  direccion:any = {};
  direcciones:any[]=[];

  lugares:any[]=[];
  lugar:any;

  id_usuario:any;

  constructor(
    private direccionService: DireccionesService,
    private lugarService: LugarService,
    private toastr: ToastrService
  ) 
  {

  }

  ngOnInit() {
    this.id_usuario = parseInt(sessionStorage.getItem('id_usuario') ?? '');
    this.getLugares();
    this.getDirecciones();
  }

  getLugares() {
    this.lugarService.getLugares().subscribe(data => {
      this.lugares = data;
    });
  }

  onLocalidadSeleccionada() {
    console.log('Lugar seleccionado:', this.lugar);
  }

  getDirecciones() {
    this.direccionService.getDireccionesPorUsuario(this.id_usuario).subscribe(data => {
      this.direcciones = data;
    });
  }

  registrarDireccion(registerDirForm:NgForm) {
    if (this.isValidForm(registerDirForm)) {
      this.direccionService.registrarDireccion(this.direccion, this.id_usuario).subscribe(response =>{
        this.toastr.success('Dirección registrada correctamente');
        this.getDirecciones();
        this.limpiar();
      });
    } 
  }

  isValidForm(registerDirForm:NgForm): boolean {
      if (!registerDirForm.value.direccion) {
        this.toastr.warning('El campo Dirección es obligatorio');
        return false;
      }
      if (!registerDirForm.value.id_lugar) {
        this.toastr.warning('El campo Referencia es obligatorio');
        return false;
      }
      return true;
  }

  editarDireccion() {
    
  }

  limpiar() {
    this.direccion.direccion = '';
  }


}
