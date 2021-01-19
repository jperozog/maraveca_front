import { Pipe, PipeTransform } from '@angular/core';
import { ListKeyManager } from '@angular/cdk/a11y';

@Pipe({
  name: 'filtradoInvetnario'
})
export class FiltradoInvetnarioPipe implements PipeTransform {
 

  transform(lista: any[], texto: string): any[] {

    const resultEquipos = [];
    console.log(texto)
    if(!texto) return lista;
    return lista.filter(lista =>lista.modelo_articulo.toUpperCase().includes(texto.toUpperCase()))
    
  }

}
