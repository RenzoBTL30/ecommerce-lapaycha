import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from 'src/app/models/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  usuario:Usuario = new Usuario();
  id_usuario?:number;

  constructor (
    private clienteService: ClienteService,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
  ) {

  }
  ngOnInit() {
    this.id_usuario = parseInt(sessionStorage.getItem('id_usuario') ?? '');
    this.getDatosCliente();
  }

  getDatosCliente() {
    this.clienteService.getDatosCliente(this.id_usuario!).subscribe(data => {
      this.usuario = data[0];
    });
  }

  isValidForm(updateDataForm:NgForm): boolean {

      //Valida si el email cumple con el formato y si hay un email ingresado en el input
      if (!this.validarEmail(updateDataForm.value.email)) {
        this.toastr.error('El correo electrónico no es válido');
        return false;
      } 
      
      //Valida si el telefono cumple con el formato y si hay un numero ingresado en el input
      if (!this.validarTelefono(updateDataForm.value.celular)) {
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

  actualizarDatosCliente(updateDataForm:NgForm) {
    if (this.isValidForm(updateDataForm)) {
      this.clienteService.actualizarDatosCliente(this.id_usuario!, this.usuario).subscribe(res => {
        this.authService.guardarUsuario(this.usuario);
        this.reloadPage();
        //this.toastr.success('Los datos han sido actualizados');
      });
    } 
  }

  reloadPage() {    
    this.router.navigate(['/cuenta/perfil']).then(() => {
      window.location.reload();
    });
  }

}
