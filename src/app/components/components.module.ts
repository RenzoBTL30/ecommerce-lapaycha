import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InicioComponent } from './inicio/inicio.component';
import { SharedModule } from '../shared/shared.module';
import { CartaComponent } from './carta/carta.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './usuario/home/home.component';
import { PedidosComponent } from './usuario/pedidos/pedidos.component';
import { DireccionesComponent } from './usuario/direcciones/direcciones.component';
import { PuntosDescuentoComponent } from './usuario/puntos-descuento/puntos-descuento.component';
import { PerfilComponent } from './usuario/perfil/perfil.component';
import { CambiarContraseniaComponent } from './usuario/cambiar-contrasenia/cambiar-contrasenia.component';
import { PedidoDetalleComponent } from './usuario/pedido-detalle/pedido-detalle.component';
import { PedidosCompletadosComponent } from './usuario/pedidos-completados/pedidos-completados.component';

@NgModule({
  declarations: [
    InicioComponent,
    CartaComponent,
    CheckoutComponent,
    RegisterComponent,
    LoginComponent,
    ProductoDetalleComponent,
    HomeComponent,
    PedidosComponent,
    DireccionesComponent,
    PuntosDescuentoComponent,
    PerfilComponent,
    CambiarContraseniaComponent,
    PedidoDetalleComponent,
    PedidosCompletadosComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    InicioComponent
  ],
  providers: [
    DatePipe
  ]
})
export class ComponentsModule { }
