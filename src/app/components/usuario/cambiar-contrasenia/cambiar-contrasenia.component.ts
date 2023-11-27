import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/usuario';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cambiar-contrasenia',
  templateUrl: './cambiar-contrasenia.component.html',
  styleUrls: ['./cambiar-contrasenia.component.css']
})
export class CambiarContraseniaComponent implements OnInit {

  usuario:Usuario = new Usuario();
  id_usuario?:number;

  visible:boolean = true;
  visible2:boolean = true;

  changetype:boolean =true;
  changetypeconfirm:boolean =true;

  @ViewChild('confirmcontrasenia') confirmcontrasenia:any;

  constructor(
    private clienteService: ClienteService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit() {
    this.id_usuario = parseInt(sessionStorage.getItem('id_usuario') ?? '');
  }

  viewpass(){
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  viewconfirmpass(){
    this.visible2 = !this.visible2;
    this.changetypeconfirm = !this.changetypeconfirm;
  }

  isValidForm(updateDataContraseniaForm:NgForm): boolean {
    // El formulario no es válido, por lo que realizamos la validación manual de campos
      if (!updateDataContraseniaForm.value.contrasenia) {
        this.toastr.warning('Debes ingresar tu nueva contraseña');
        return false;
      }

      if (updateDataContraseniaForm.value.contrasenia !== this.confirmcontrasenia.nativeElement.value) {
        this.toastr.warning('Ambas contraseñas deben coincidir');
        return false;
      }

      return true;
  }

  actualizarContraseniaCliente(updateDataContraseniaForm:NgForm) {
    if (this.isValidForm(updateDataContraseniaForm)) {
      this.clienteService.actualizarContraseniaCliente(this.id_usuario!, this.usuario).subscribe(res => {
        this.toastr.success('La contraseña ha sido actualizada');
      });
    } 
  }
}
