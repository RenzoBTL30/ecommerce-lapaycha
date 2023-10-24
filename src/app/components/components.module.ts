import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './inicio/inicio.component';
import { SharedModule } from '../shared/shared.module';
import { CartaComponent } from './carta/carta.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    InicioComponent,
    CartaComponent,
    CheckoutComponent,
    RegisterComponent,
    LoginComponent,
    ProductoDetalleComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    InicioComponent
  ]
})
export class ComponentsModule { }
