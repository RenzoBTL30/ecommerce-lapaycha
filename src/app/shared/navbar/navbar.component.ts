import { Component, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  op_cart:boolean = false;

  @ViewChild('cart') cart:any;

  constructor(private render: Renderer2) {

  }

  open_modalcart() {
    if (!this.op_cart) {
      this.op_cart = true;
      this.render.addClass(this.cart.nativeElement,'show');
    } else {
      this.op_cart = false;
      this.render.removeClass(this.cart.nativeElement,'show');
    }
  }
}
