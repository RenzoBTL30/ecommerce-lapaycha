import { Component, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  credentials: any = {};

  visible:boolean = true;
  changetype:boolean =true;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    
  }

  login(loginForm:NgForm) {
    if (this.isValidForm(loginForm)) {

      let data = {
        email: this.credentials.email,
        contrasenia: this.credentials.contrasenia
      }

      try {

        this.authService.login(data).subscribe({
          next: (res) => {
            let datosUsuario = res.data;
            this.authService.guardarUsuario(datosUsuario);
            this.authService.guardarToken(datosUsuario.session_token);
        
            this.crearCarrito();
            this.navigateToHome();
        
            this.limpiar();
          },
          error: (error) => {
            this.toastr.error('Error: Los datos ingresados son incorrectos');
          }
        });

        /* DEPRECATED
        this.authService.login(data).subscribe(res => {
          console.log(res);
          let datosUsuario = res.data;
          this.authService.guardarUsuario(datosUsuario);
          this.authService.guardarToken(datosUsuario.session_token);
          
          this.crearCarrito();
          this.navigateToHome();
          this.toastr.success('Bienvenido!!');

          this.limpiar();
          
        }, (error) => {
          this.toastr.error('Error: Los datos ingresados son incorrectos');
        });
        */
      } catch (error) {
        console.error(error);
      }
    }
  }


  isValidForm(loginForm:NgForm): boolean {
      if (!loginForm.value.email) {
        this.toastr.warning('El campo Correo Electrónico es obligatorio');
        return false;
      }

      //Valida si el email cumple con el formato y si hay un email ingresado en el input
      if (!this.validarEmail(loginForm.value.email) && loginForm.value.email) {
        this.toastr.error('El correo electrónico no es válido');
        return false;
      } 

      if (!loginForm.value.contrasenia) {
        this.toastr.warning('El campo Contraseña es obligatorio');
        return false;
      }

      return true;
  }

  validarEmail(email: string): boolean {
    const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegex.test(email);
  }

  
  limpiar(): void {
    this.credentials.email = '';
    this.credentials.contrasenia = '';
  }

  navigateToHome() {
    this.router.navigate(['/']);

    /*
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
    */
  }

  crearCarrito() {
    sessionStorage.setItem('carrito','');
  }

  viewpass(){
    this.visible = !this.visible;
    this.changetype = !this.changetype;
  }
  
}
