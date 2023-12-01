import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { CartaComponent } from './components/carta/carta.component';
import { ProductoDetalleComponent } from './components/producto-detalle/producto-detalle.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/usuario/home/home.component';
import { PerfilComponent } from './components/usuario/perfil/perfil.component';
import { DireccionesComponent } from './components/usuario/direcciones/direcciones.component';
import { PuntosDescuentoComponent } from './components/usuario/puntos-descuento/puntos-descuento.component';
import { authGuard } from './guards/auth.guard';
import { CambiarContraseniaComponent } from './components/usuario/cambiar-contrasenia/cambiar-contrasenia.component';
import { PedidoDetalleComponent } from './components/usuario/pedido-detalle/pedido-detalle.component';
import { PedidosComponent } from './components/usuario/pedidos/pedidos.component';
import { PedidosCompletadosComponent } from './components/usuario/pedidos-completados/pedidos-completados.component';
import { ViewPedidoRealizadoComponent } from './components/view-pedido-realizado/view-pedido-realizado.component';

const routes: Routes = [
  { path: '', component:InicioComponent },
  { path: 'carta/:id', component: CartaComponent },
  { path: 'producto/:id', component:ProductoDetalleComponent },
  { path: 'checkout', component: CheckoutComponent, canActivate: [authGuard] },
  { path: 'pedido-realizado', component: ViewPedidoRealizadoComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  { path: 'cuenta', component:HomeComponent,
    children: [
      { path: 'perfil', component:PerfilComponent, canActivate: [authGuard] },
      { path: 'cambiar-password', component:CambiarContraseniaComponent, canActivate: [authGuard] },
      { path: 'direcciones', component:DireccionesComponent, canActivate: [authGuard] },
      { path: 'pedidos', component:PedidosComponent, canActivate: [authGuard] },
      { path: 'pedidos-completados', component:PedidosCompletadosComponent, canActivate: [authGuard] },
      { path: 'pedidos/:id', component:PedidoDetalleComponent, canActivate: [authGuard] },
      { path: 'puntos-descuento', component:PuntosDescuentoComponent, canActivate: [authGuard] },
    ],
    
  },
  { path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
