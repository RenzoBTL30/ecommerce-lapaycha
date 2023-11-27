import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
  usuario:any = {};
  visible:boolean = true;
  visible2:boolean = true;

  changetype:boolean =true;
  changetypeconfirm:boolean =true;
  @ViewChild('confirmcontrasenia') confirmcontrasenia:any;

  constructor(
    private clienteService: ClienteService,
    private toastr: ToastrService,
    private router: Router

  ) {

  }

  registrarCliente(registerForm:NgForm) {
    if (this.isValidForm(registerForm)) {
      this.clienteService.registrarCliente(this.usuario).subscribe(responseRegistro =>{
        this.clienteService.asignarRolCliente(responseRegistro.id_usuario, 3).subscribe(responseAsignar => {
          this.router.navigate(['/login']);
          this.toastr.success('Registro correcto');
        })
      });

    } 
  }

  viewpass(){
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }

  viewconfirmpass(){
    this.visible2 = !this.visible2;
    this.changetypeconfirm = !this.changetypeconfirm;
  }

  isValidForm(registerForm:NgForm): boolean {
    // El formulario no es válido, por lo que realizamos la validación manual de campos
      if (!registerForm.value.nombre) {
        this.toastr.warning('El campo Nombre es obligatorio');
        return false;
      }
      if (!registerForm.value.apellidos) {
        this.toastr.warning('El campo Apellidos es obligatorio');
        return false;
      }
      if (!registerForm.value.celular) {
        this.toastr.warning('El campo Teléfono es obligatorio');
        return false;
      }
      if (!registerForm.value.email) {
        this.toastr.warning('El campo Correo Electrónico es obligatorio');
        return false;
      }
      if (!registerForm.value.contrasenia) {
        this.toastr.warning('El campo Contraseña es obligatorio');
        return false;
      }

      if (registerForm.value.contrasenia !== this.confirmcontrasenia.nativeElement.value) {
        this.toastr.warning('Ambas contraseñas deben coincidir');
        return false;
      }

      //Valida si el email cumple con el formato y si hay un email ingresado en el input
      if (!this.validarEmail(registerForm.value.email) && registerForm.value.email) {
        this.toastr.error('El correo electrónico no es válido');
        return false;
      } 
      
      //Valida si el telefono cumple con el formato y si hay un numero ingresado en el input
      if (!this.validarTelefono(registerForm.value.celular) && registerForm.value.celular) {
        this.toastr.error('El número de teléfono debe contener solo dígitos');
        return false;
      }
      return true;
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
  }

  validarTelefono(telefono: string): boolean {
    const telefonoRegex = /^[0-9]+$/;
    return telefonoRegex.test(telefono);
  }
}
