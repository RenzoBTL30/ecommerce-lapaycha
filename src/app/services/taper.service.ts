import { Injectable } from '@angular/core';
import { Taper } from '../models/taper';

@Injectable({
  providedIn: 'root'
})
export class TaperService {

  taper:Taper = new Taper();

  constructor() {
    
  }
}
