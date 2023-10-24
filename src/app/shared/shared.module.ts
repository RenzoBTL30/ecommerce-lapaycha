import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { RouterModule } from '@angular/router';
import { NavbarCartaComponent } from './navbar-carta/navbar-carta.component';
import { SidebarUsuarioComponent } from './sidebar-usuario/sidebar-usuario.component';
import { FormsModule } from '@angular/forms';
import { CarritoModalComponent } from './modals/carrito-modal/carrito-modal.component';


@NgModule({
  declarations: [
    NavbarComponent,
    FooterComponent,
    NavbarCartaComponent,
    SidebarUsuarioComponent,
    CarritoModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    NavbarComponent,
    FooterComponent,
    NavbarCartaComponent,
    SidebarUsuarioComponent,
    CarritoModalComponent
  ]
})
export class SharedModule { }
