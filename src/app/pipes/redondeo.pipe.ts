import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'redondeo'
})
export class RedondeoPipe implements PipeTransform {

  transform(valor: number): number {
    // Puedes personalizar la lógica de redondeo según tus necesidades.
    return Math.round(valor);
  }

}
